import * as esbuild from "https://deno.land/x/esbuild@v0.15.16/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";

const importMapURL = new URL("../import_map.json", import.meta.url);

const isWatching = Deno.args[0] === "--watch";

await esbuild.build({
  plugins: [
    denoPlugin({
      importMapURL,
    }),
  ],
  entryPoints: ["src/main.tsx"],
  outfile: `./dist/assets/simwillow.js`,
  bundle: true,
  format: "esm",
  platform: "browser",
  watch: isWatching,
  jsxImportSource: "preact",
  jsx: "automatic",
});

if (!isWatching) {
  Deno.exit(0);
}
