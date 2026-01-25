export default {
  entry: ["src/main.ts", "src/app.css", "callback/schoology/main.ts"],
  project: ["src/**", "callback/**"],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join("\n"),
  },
};
