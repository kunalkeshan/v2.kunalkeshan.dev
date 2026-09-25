import packageJson from "@/package.json";

/**
 * This app's version, read from its own `package.json` at build time.
 * Bumped by `.github/workflows/sync-version.yml` when a `web-vX.Y.Z`
 * GitHub Release is published — see `docs/runbooks/releases.md`.
 */
export const APP_VERSION: string = packageJson.version;
