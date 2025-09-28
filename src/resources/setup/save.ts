import { encode, getStorage } from "monoidentity";
import type { AuthBase } from "../../lib/api/schoology";
import getId from "./get-id.remote";

export const save = async (auth: AuthBase, shouldEncode = false) => {
  const encodedAuth = { ...auth };
  if (shouldEncode) {
    encodedAuth.token = {
      key: encode(auth.token.key),
      secret: encode(auth.token.secret),
    };
  }
  const { id } = await getId(encodedAuth);
  const fullAuth = { ...encodedAuth, userId: id };

  const storage = getStorage("config");
  storage.schoology = fullAuth;
};
