import { fn } from 'monoserve';
import { string } from 'valibot';
import { verifyJWT } from 'monoidentity-verification';
import { SC_KNOWN_TOKENS } from '$env/static/private';
import type { FullAuth } from '../../../lib/api/schoology';
const knownTokens = JSON.parse(SC_KNOWN_TOKENS);

export default fn(string(), async (jwt) => {
  const payload = await verifyJWT(jwt);
  const email = payload.sub;
  const auth = knownTokens[email];
  return auth as FullAuth | undefined;
});
