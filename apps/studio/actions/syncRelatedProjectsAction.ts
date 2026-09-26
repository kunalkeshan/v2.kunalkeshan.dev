import type {
  DocumentActionComponent,
  DocumentActionProps,
  SanityClient,
} from "sanity";

/**
 * Wraps the built-in `publish` action for the `project` document type so
 * editing `relatedProjects` on one project stays in sync on the other side:
 * publishing project A with project B added to its list patches B's own
 * `relatedProjects` (both draft and published copies) to add A back, and
 * removing B from A's list removes A from B's side. Nothing is written
 * unless the underlying publish itself succeeds first.
 *
 * Deliberately writes via direct `client.patch(...).commit()` calls rather
 * than going through the Studio actions system again — patching B this way
 * never re-triggers this same sync action for B, so there's no recursion to
 * guard against.
 *
 * Known gap: deleting a project doesn't clean up any `relatedProjects`
 * entries that pointed to it elsewhere. Sanity references don't hard-break
 * when their target is gone; the GROQ dereference (`relatedProjects[]->`)
 * just silently omits the missing document, so the dangling entry is
 * invisible on the front end but stays in the dataset until manually
 * removed in Studio.
 */

interface ProjectReference {
  _type: "reference";
  _ref: string;
  _key: string;
}

function referencedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids = value
    .map((item) => (item as Partial<ProjectReference>)?._ref)
    .filter((ref): ref is string => Boolean(ref));
  return Array.from(new Set(ids));
}

async function addBackReference(
  client: SanityClient,
  targetId: string,
  sourceId: string
) {
  const target = await client.getDocument(targetId);
  if (!target) return;

  if (referencedIds(target.relatedProjects).includes(sourceId)) return;

  await client
    .patch(targetId)
    .setIfMissing({ relatedProjects: [] })
    .append("relatedProjects", [
      { _type: "reference", _ref: sourceId, _key: crypto.randomUUID() },
    ])
    .commit();
}

async function removeBackReference(
  client: SanityClient,
  targetId: string,
  sourceId: string
) {
  const target = await client.getDocument(targetId);
  if (!target) return;

  const matches = (
    (target.relatedProjects as ProjectReference[] | undefined) ?? []
  ).filter((ref) => ref?._ref === sourceId);
  if (matches.length === 0) return;

  await client
    .patch(targetId)
    .unset(matches.map((ref) => `relatedProjects[_key=="${ref._key}"]`))
    .commit();
}

async function syncRelatedProjects(
  client: SanityClient,
  sourceId: string,
  addedIds: string[],
  removedIds: string[]
) {
  await Promise.all([
    ...addedIds.flatMap((targetId) => [
      addBackReference(client, targetId, sourceId),
      addBackReference(client, `drafts.${targetId}`, sourceId),
    ]),
    ...removedIds.flatMap((targetId) => [
      removeBackReference(client, targetId, sourceId),
      removeBackReference(client, `drafts.${targetId}`, sourceId),
    ]),
  ]);
}

/**
 * Returns a function that wraps a `DocumentActionComponent` (the built-in
 * `publish` action) with the sync behaviour above. `client` is resolved once
 * from the `document.actions` config context in `sanity.config.ts`.
 */
export function createRelatedProjectsSync(client: SanityClient) {
  return function withRelatedProjectsSync(
    publishAction: DocumentActionComponent
  ): DocumentActionComponent {
    const SyncedPublishAction: DocumentActionComponent = (
      props: DocumentActionProps
    ) => {
      const original = publishAction(props);
      if (!original) return original;

      return {
        ...original,
        onHandle: async () => {
          // `props.published` is the state before this publish — the diff
          // base. `props.draft` (falling back to `props.published` when
          // there's no pending draft) is what's about to become published.
          const previousIds = referencedIds(
            props.published?.relatedProjects
          );
          const nextIds = referencedIds(
            (props.draft ?? props.published)?.relatedProjects
          );
          const addedIds = nextIds.filter((id) => !previousIds.includes(id));
          const removedIds = previousIds.filter(
            (id) => !nextIds.includes(id)
          );

          await original.onHandle?.();

          if (addedIds.length > 0 || removedIds.length > 0) {
            await syncRelatedProjects(client, props.id, addedIds, removedIds);
          }
        },
      };
    };

    SyncedPublishAction.action = publishAction.action;
    SyncedPublishAction.displayName = "SyncedPublishAction";
    return SyncedPublishAction;
  };
}
