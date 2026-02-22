import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { functionsMixins } from 'vite-plugin-functions-mixins';
import { monoserve } from 'monoserve/plugin';
import { build as rolldownBuild } from 'rolldown';
import { importGlobPlugin } from 'rolldown/experimental';
// @ts-expect-error not installing node types here
import { resolve } from 'node:path';

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

const inject = {
  MONOIDENTITY_APP_ID: [resolve('./monoidentity-config.ts'), 'MONOIDENTITY_APP_ID'],
  MONOIDENTITY_SYNC_FOR: [resolve('./monoidentity-config.ts'), 'MONOIDENTITY_SYNC_FOR'],
} satisfies Record<string, [string, string]>;

export default defineConfig({
  plugins: [
    svelte(),
    functionsMixins({ deps: ['m3-svelte'] }),
    monoserve({ monoserverURL: '/__monoserve/' }),
    buildCloudflareWorker(),
  ],
  build: {
    rolldownOptions: {
      input: {
        index: 'index.html',
        'callback/schoology': 'callback/schoology.html',
      },
      transform: { inject },
    },
  },
  optimizeDeps: {
    rolldownOptions: {
      transform: { inject },
    },
  },
});
