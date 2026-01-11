import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { siteConfigType } from "./siteConfigType";
import { legalType } from "./legalType";
import { faqsType } from "./faqsType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, siteConfigType, legalType, faqsType],
};
