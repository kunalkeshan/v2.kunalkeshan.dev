import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Kunal Keshan")
    .items([
      S.listItem()
        .title("Site Configuration")
        .child(S.document().schemaType("siteConfig").documentId("siteConfig")),
      S.listItem()
        .title("FAQs")
        .child(S.document().schemaType("faqs").documentId("faqs")),
      S.documentTypeListItem("legal").title("Legal"),
      orderableDocumentListDeskItem({
        type: "skill",
        title: "Skills",
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "service",
        title: "Services",
        S,
        context,
      }),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["siteConfig", "legal", "faqs", "skill", "service"].includes(
            item.getId()!
          )
      ),
    ]);
