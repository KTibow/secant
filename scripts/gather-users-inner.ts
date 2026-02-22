import { homedir } from "os";
import { readFile } from "node:fs/promises";
import { createSchoology, type AuthBase, type FullAuth } from "../src/lib/api/schoology.ts";

let auth: Record<string, AuthBase & Partial<FullAuth>> = {};

let source1 = await readFile(
  `${homedir()}/Downloads/db_cluster-15-12-2023@15-04-16.backup`,
  "utf8",
);
source1 = source1.split(/COPY public\.schoology_users.+/)[1];
source1 = source1.split(/^\\\.$/m)[0];
source1 = source1.trim();
for (const line of source1.split("\n")) {
  const [_, key, secret, email] = line.split("\t");
  auth[email] = { token: { key, secret }, appToken: "a1" };
}

let source2 = await readFile(`${homedir()}/Downloads/legacy_sc_users_rows.csv`, "utf8");
source2 = source2.split("\n").slice(1).join("\n").trim();
for (const line of source2.split("\n")) {
  const [email, key, secret] = line.split(",");
  auth[email] = { token: { key, secret }, appToken: "75" };
}

console.warn("enriching...");
for (const [email, a] of Object.entries(auth)) {
  const schoology = createSchoology(a);
  try {
    const me = await schoology(new Request("https://api.schoology.com/v1/users/me"));
    a.userId = me.id;
  } catch (e) {
    try {
      console.warn(`retrying ${email}`);
      const me = await schoology(new Request("https://api.schoology.com/v1/users/me"));
      a.userId = me.id;
    } catch (e) {
      console.warn(`failed to enrich ${email}`);
      console.warn(e);
      delete auth[email];
    }
  }
}

console.log(JSON.stringify(auth));
console.warn(Object.keys(auth).length);
