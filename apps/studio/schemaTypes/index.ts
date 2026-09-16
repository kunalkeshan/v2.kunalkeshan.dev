import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { siteConfigType } from "./siteConfigType";
import { legalType } from "./legalType";
import { faqsType } from "./faqsType";
import { skillType } from "./skillType";
import { serviceType } from "./serviceType";
import { organizationType } from "./organizationType";
import { experienceType } from "./experienceType";
import { publicationType } from "./publicationType";
import { projectType } from "./projectType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    siteConfigType,
    legalType,
    faqsType,
    skillType,
    serviceType,
    organizationType,
    experienceType,
    publicationType,
    projectType,
  ],
};
