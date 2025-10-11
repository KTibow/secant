import { useVerification } from "monoidentity/server";
import { fn } from "monoserve";
import { string } from "valibot";
import { SC_KNOWN_TOKENS } from "$env/static/private";
import type { FullAuth } from "../../../lib/api/schoology";
const knownTokens = JSON.parse(SC_KNOWN_TOKENS);

export default fn(string(), async (jwt) => {
  const { payload } = await useVerification(jwt);
  const email = payload.sub as string;
  const auth = knownTokens[email];
  return auth as FullAuth | undefined;
});
