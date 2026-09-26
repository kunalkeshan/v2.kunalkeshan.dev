import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const title = process.env.SANITY_STUDIO_TITLE;

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION || "2026-01-08";

// The web app origin the Presentation Tool previews against. Resolved
// automatically by Sanity's own env-mode file loading — no manual swap
// needed: `sanity dev` runs in "development" mode (.env / .env.local),
// `sanity build`/`sanity deploy` run in "production" mode (.env.production),
// so this always picks up the right value for the command being run. See
// docs/runbooks/sanity-workflow.md ("Presentation Tool preview origin").
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN || "http://localhost:3000";

import { createRelatedProjectsSync } from "./actions/syncRelatedProjectsAction";
import { resolve } from "./presentation/resolve";
import { schema } from "./schemaTypes";
import { structure } from "./structure";

export default defineConfig({
  name: "default",
  title,
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  document: {
    // Only `project`'s own publish action gets the `relatedProjects` sync
    // (see `./actions/syncRelatedProjectsAction.ts`) — every other schema
    // type's actions pass through untouched.
    actions: (prev, context) => {
      if (context.schemaType !== "project") return prev;

      const withRelatedProjectsSync = createRelatedProjectsSync(
        context.getClient({ apiVersion })
      );
      return prev.map((action) =>
        action.action === "publish" ? withRelatedProjectsSync(action) : action
      );
    },
  },
});
