import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { functionsMixins } from "vite-plugin-functions-mixins";
import { monoserve } from "monoserve/plugin";

export default defineConfig({
  plugins: [
    svelte(),
    functionsMixins({ deps: ["m3-svelte"] }),
    monoserve({ monoserverURL: "https://benignmonoserver.fly.dev" }),
  ],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        "callback/schoology": "callback/schoology.html",
      },
    },
  },
});
