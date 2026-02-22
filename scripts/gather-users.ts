import { rolldown } from 'rolldown';

const bundle = await rolldown({
  input: './scripts/gather-users-inner.ts',
  plugins: [
    {
      name: 'virtual',
      resolveId(id) {
        if (id == '$env/static/private') return id;
      },
      async load(id) {
        if (id == '$env/static/private') {
          let js = '';
          // @ts-expect-error not used to node
          for (const [key, value] of Object.entries(process.env)) {
            if (!/^[A-Z0-9_]+$/.test(key)) continue;
            js += `export const ${key} = ${JSON.stringify(value)};\n`;
          }

          return js;
        }
      },
    },
  ],
});
await bundle.write({
  file: '/tmp/gather-users.js',
});

// @ts-expect-error unknown file
await import('/tmp/gather-users.js');
