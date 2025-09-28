import { homedir } from "os";
import { readFile } from "node:fs/promises";

let out = {};

let source1 = await readFile(
  `${homedir()}/Downloads/db_cluster-15-12-2023@15-04-16.backup`,
  "utf8",
);
source1 = source1.split(/COPY public\.schoology_users.+/)[1];
source1 = source1.split(/^\\\.$/m)[0];
source1 = source1.trim();
for (const line of source1.split("\n")) {
  const [_, key, secret, email] = line.split("\t");
  out[email] = { token: { key, secret }, appToken: "a1" };
}

let source2 = await readFile(`${homedir()}/Downloads/legacy_sc_users_rows.csv`, "utf8");
source2 = source2.split("\n").slice(1).join("\n").trim();
for (const line of source2.split("\n")) {
  const [email, key, secret] = line.split(",");
  out[email] = { token: { key, secret }, appToken: "75" };
}

console.log(JSON.stringify(out));
console.warn(Object.keys(out).length);
