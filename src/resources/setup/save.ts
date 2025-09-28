import { getStorage } from "monoidentity";
import type { FullAuth } from "../../lib/api/schoology";

export const save = (auth: FullAuth) => {
  const storage = getStorage("config");
  storage.schoology = auth;
};
