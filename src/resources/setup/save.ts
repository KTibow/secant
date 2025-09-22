import { encode, getStorage } from "monoidentity";
import type { AuthBase } from "../../lib/api/schoology";
import getId from "./get-id.remote";

export const save = async (auth: AuthBase) => {
  const encodedAuth = {
    ...auth,
    token: {
      key: encode(auth.token.key),
      secret: encode(auth.token.secret),
    },
  };
  const { id } = await getId(encodedAuth);
  const fullAuth = { ...encodedAuth, userId: id };

  const storage = getStorage("config");
  storage.schoology = fullAuth;
};
