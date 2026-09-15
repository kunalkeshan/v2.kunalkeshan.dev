import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { siteConfigType } from "./siteConfigType";
import { legalType } from "./legalType";
import { faqsType } from "./faqsType";
import { skillType } from "./skillType";
import { serviceType } from "./serviceType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    siteConfigType,
    legalType,
    faqsType,
    skillType,
    serviceType,
  ],
};
