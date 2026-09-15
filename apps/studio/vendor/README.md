# vendor/lexorank.esm.js

Workaround for https://github.com/sanity-io/plugins/issues/2011 —
`@sanity/orderable-document-list` depends on `lexorank@^1.0.5`, which is
CommonJS-only and unmaintained (last publish 2022-08-31). Sanity Studio v6's
`sanity schema extract` (and therefore `sanity deploy`, and this repo's
`pnpm --filter studio extract`) loads the whole config graph in a Vite
worker with `ssr.noExternal: true`, which can't bundle a CJS-only dependency
and fails with `SchemaExtractionError: exports is not defined`.

This file is a re-bundle of the **same published `lexorank@1.0.5` package**
(not a reimplementation — the actual ranking algorithm, unmodified) as an
ESM module with proper named exports, aliased in `sanity.cli.ts`'s `vite`
hook so every consumer (extraction, dev, build) resolves `lexorank` to this
file instead of the CJS original.

## Regenerating

If `@sanity/orderable-document-list` bumps its `lexorank` version, or this
file needs rebuilding for any reason, from the repo root:

```js
node -e "
const esbuild = require('esbuild'); // resolve from wherever it's installed
esbuild.buildSync({
  entryPoints: ['node_modules/.pnpm/lexorank@<version>/node_modules/lexorank/lib/index.js'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: 'apps/studio/vendor/lexorank.esm.js',
  target: 'es2020',
});
"
```

Then manually replace the trailing `export default require_index();` line
with:

```js
var lexorank_default = require_index();
export default lexorank_default;
export const LexoRank = lexorank_default.LexoRank;
export const LexoDecimal = lexorank_default.LexoDecimal;
export const LexoInteger = lexorank_default.LexoInteger;
export const LexoNumeralSystem10 = lexorank_default.LexoNumeralSystem10;
export const LexoNumeralSystem36 = lexorank_default.LexoNumeralSystem36;
export const LexoNumeralSystem64 = lexorank_default.LexoNumeralSystem64;
```

esbuild's CJS→ESM interop only produces a `default` export for this
package's `__exportStar`-based re-export pattern — the named exports above
make `import { LexoRank } from "lexorank"` resolve correctly for consumers
(like the orderable-document-list plugin's compiled output) that use named
imports.

Verify after regenerating:

```js
node --input-type=module -e "
import { LexoRank } from './apps/studio/vendor/lexorank.esm.js';
console.log(LexoRank.middle().toString());
"
```

Should print a rank like `0|hzzzzz:` — if it throws or logs `undefined`,
the named-export patch above didn't apply correctly.

## Removing this workaround

Safe to delete this file, the `vite` hook in `sanity.cli.ts`, and this
README once either:

- `@sanity/orderable-document-list` ships a version that bundles/replaces
  `lexorank` with an ESM-compatible dependency, or
- `lexorank` itself ships an ESM build upstream (unlikely — unmaintained).

Check the upstream issue for status: https://github.com/sanity-io/plugins/issues/2011
