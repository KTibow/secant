import { fn } from "monoserve";
import { authBase, createSchoology, type AuthBase } from "../../src/lib/api/schoology";
import { encode } from "monoidentity";

export default fn(authBase, async (auth) => {
  const schoology = createSchoology(auth);

  const tokenRaw = await schoology(new Request("https://api.schoology.com/v1/oauth/access_token"));
  const tokenData = new URLSearchParams(tokenRaw);
  const token = {
    key: encode(tokenData.get("oauth_token")!),
    secret: encode(tokenData.get("oauth_token_secret")!),
  };

  return {
    token,
    appToken: "75",
  } satisfies AuthBase;
});
