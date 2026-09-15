import { config } from "@workspace/eslint-config/react-internal"

/**
 * `.mjs`, not `.js`: this package has no `"type": "module"`, so a plain
 * `eslint.config.js` would be parsed as CommonJS and the `import` above
 * would throw. See docs/runbooks/linting.md.
 *
 * @type {import("eslint").Linter.Config}
 */
export default [
  ...config,
  { ignores: [".sanity/**", "vendor/**", "dist/**", "schema.json"] },
]
