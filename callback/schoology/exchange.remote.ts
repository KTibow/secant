import { fn } from "monoserve";
import { authBase, createSchoology, type FullAuth } from "../../src/lib/api/schoology";
import { encode } from "monoidentity";

export default fn(authBase, async (auth) => {
  const schoology = createSchoology(auth);

  const tokenRaw = await schoology(new Request("https://api.schoology.com/v1/oauth/access_token"));
  const tokenData = new URLSearchParams(tokenRaw);
  const token = {
    key: encode(tokenData.get("oauth_token")!),
    secret: encode(tokenData.get("oauth_token_secret")!),
  };

  const me = await schoology(new Request("https://api.schoology.com/v1/users/me"));

  return {
    token,
    appToken: "75",
    userId: me.id,
  } satisfies FullAuth;
});
