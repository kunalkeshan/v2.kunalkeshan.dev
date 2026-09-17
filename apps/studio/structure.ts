import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
// Deep imports, not a barrel import: `@sanity/icons`' root export only exposes
// `Icon` and `icons`, so `import { CogIcon } from "@sanity/icons"` typechecks
// but fails at bundle time with MISSING_EXPORT.
import { CogIcon } from "@sanity/icons/Cog";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { SparklesIcon } from "@sanity/icons/Sparkles";
import { WrenchIcon } from "@sanity/icons/Wrench";
import { HeartIcon } from "@sanity/icons/Heart";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { CaseIcon } from "@sanity/icons/Case";
import { UsersIcon } from "@sanity/icons/Users";
import { BookIcon } from "@sanity/icons/Book";
import { UserIcon } from "@sanity/icons/User";
import { DoubleQuoteIcon } from "@sanity/icons/DoubleQuote";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Kunal Keshan")
    .items([
      S.listItem()
        .title("Site Configuration")
        .icon(CogIcon)
        .child(S.document().schemaType("siteConfig").documentId("siteConfig")),
      S.listItem()
        .title("FAQs")
        .icon(HelpCircleIcon)
        .child(S.document().schemaType("faqs").documentId("faqs")),
      S.documentTypeListItem("legal").title("Legal").icon(DocumentTextIcon),
      orderableDocumentListDeskItem({
        type: "skill",
        title: "Skills",
        icon: SparklesIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "service",
        title: "Services",
        icon: WrenchIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "value",
        title: "Values",
        icon: HeartIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "project",
        title: "Projects",
        icon: ProjectsIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "experience",
        title: "Experience",
        icon: CaseIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "organization",
        title: "Organizations",
        icon: UsersIcon,
        S,
        context,
      }),
      // People sit next to Organizations rather than next to Testimonials:
      // both are the reference targets other documents point at, and grouping
      // them keeps the "edit the shared record once" surfaces together.
      orderableDocumentListDeskItem({
        type: "person",
        title: "People",
        icon: UserIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "testimonial",
        title: "Testimonials",
        icon: DoubleQuoteIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "publication",
        title: "Publications",
        icon: BookIcon,
        S,
        context,
      }),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            "siteConfig",
            "legal",
            "faqs",
            "skill",
            "service",
            "value",
            "project",
            "experience",
            "organization",
            "publication",
            "person",
            "testimonial",
          ].includes(item.getId()!)
      ),
    ]);
