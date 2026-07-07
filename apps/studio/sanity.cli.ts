/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import "dotenv/config";
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
// User-application ID used by `sanity deploy`. Generated on the first deploy;
// set it as SANITY_STUDIO_APP_ID so later deploys target the same app.
// https://www.sanity.io/docs/help/studio-host-user-applications
const appId = process.env.SANITY_STUDIO_APP_ID || undefined;

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId,
  },
  typegen: {
    path: "../../packages/sanity/src/**/*.{ts,tsx,js,jsx}",
    schema: "schema.json",
    generates: "../../packages/sanity/src/sanity.types.ts",
    overloadClientMethods: true,
  },
});
