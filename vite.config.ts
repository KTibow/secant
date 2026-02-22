import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { functionsMixins } from 'vite-plugin-functions-mixins';
import { monoserve } from 'monoserve/plugin';
import { build as rolldownBuild } from 'rolldown';
import { importGlobPlugin } from 'rolldown/experimental';

const buildCloudflareWorker = (): Plugin => ({
  name: 'build-cloudflare-worker',
  apply: 'build',
  closeBundle: {
    sequential: true,
    async handler() {
      await rolldownBuild({
        input: 'worker.ts',
        plugins: [importGlobPlugin()],
        output: {
          file: 'dist-worker.js',
          format: 'esm',
          inlineDynamicImports: true,
        },
      });
    },
  },
});

export default defineConfig({
  plugins: [
    svelte(),
    functionsMixins({ deps: ['m3-svelte'] }),
    monoserve({ monoserverURL: '/__monoserve/' }),
    buildCloudflareWorker(),
  ],
  define: { MONOIDENTITY_APP_ID: JSON.stringify('secant') },
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        'callback/schoology': 'callback/schoology.html',
      },
    },
  },
});
