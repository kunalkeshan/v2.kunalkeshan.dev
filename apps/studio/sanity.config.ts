import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const title = process.env.SANITY_STUDIO_TITLE;

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION || "2026-01-08";

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
  ],
});
