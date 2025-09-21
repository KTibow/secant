import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { monoserve } from "monoserve/plugin";

export default defineConfig({
  plugins: [svelte(), monoserve({ monoserverURL: "https://benignmonoserver.fly.dev" })],
});
