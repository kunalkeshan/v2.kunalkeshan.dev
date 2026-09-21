import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { siteConfigType } from "./siteConfigType";
import { legalType } from "./legalType";
import { faqsType } from "./faqsType";
import { skillType } from "./skillType";
import { serviceType } from "./serviceType";
import { valueType } from "./valueType";
import { organizationType } from "./organizationType";
import { experienceType } from "./experienceType";
import { certificationType } from "./certificationType";
import { publicationType } from "./publicationType";
import { projectType } from "./projectType";
import { personType } from "./personType";
import { testimonialType } from "./testimonialType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    siteConfigType,
    legalType,
    faqsType,
    skillType,
    serviceType,
    valueType,
    organizationType,
    experienceType,
    certificationType,
    publicationType,
    projectType,
    personType,
    testimonialType,
  ],
};
