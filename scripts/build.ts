import * as esbuild from "https://deno.land/x/esbuild@v0.17.19/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";

const importMapURL = new URL("../import_map.json", import.meta.url);

const isWatching = Deno.args[0] === "--watch";

if (isWatching) {
  const context = await esbuild.context({
    plugins: [
      ...denoPlugins({
        importMapURL: importMapURL.toString(),
      }),
    ],
    entryPoints: ["src/main.tsx"],
    outfile: `./dist/assets/simwillow.js`,
    bundle: true,
    format: "esm",
    platform: "browser",

    jsxImportSource: "preact",
    jsx: "automatic",
  });

  await context.watch();
  await context.serve({
    servedir: "./dist",
  });
} else {
  await esbuild.build({
    plugins: [
      ...denoPlugins({
        importMapURL: importMapURL.toString(),
      }),
    ],
    entryPoints: ["src/main.tsx"],
    outfile: `./dist/assets/simwillow.js`,
    bundle: true,
    format: "esm",
    platform: "browser",

    jsxImportSource: "preact",
    jsx: "automatic",
  });
}

if (!isWatching) {
  Deno.exit(0);
}
