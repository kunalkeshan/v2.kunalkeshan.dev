/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import path from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
// User-application ID used by `sanity deploy`. Generated on the first deploy;
// set it as SANITY_STUDIO_APP_ID so later deploys target the same app.
// https://www.sanity.io/docs/help/studio-host-user-applications
const appId = process.env.SANITY_STUDIO_APP_ID || undefined;

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
  vite: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // @sanity/orderable-document-list depends on lexorank@1.0.5, which
        // ships CommonJS-only (no ESM build, unmaintained since 2022) and
        // crashes `sanity schema extract`'s Vite worker with
        // "SchemaExtractionError: exports is not defined" — the worker
        // runs with ssr.noExternal:true and can't bundle a CJS-only dep.
        // See https://github.com/sanity-io/plugins/issues/2011. This alias
        // redirects lexorank to a vendored ESM re-bundle of the same
        // published package (same algorithm, just re-exported as ESM) —
        // see vendor/README.md for how it was generated.
        lexorank: path.join(dirname, "vendor/lexorank.esm.js"),
      },
    },
  }),
});
