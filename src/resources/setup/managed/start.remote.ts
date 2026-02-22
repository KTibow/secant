import { fn } from 'monoserve';
import { internalCreateSchoology, type AuthBase } from '../../../lib/api/schoology';
import { SC_KEY_75, SC_SECRET_75 } from '$env/static/private';

export default fn(async () => {
  const schoology = internalCreateSchoology(SC_KEY_75, SC_SECRET_75);

  const tokenRaw = await schoology(new Request('https://api.schoology.com/v1/oauth/request_token'));
  const tokenData = new URLSearchParams(tokenRaw);
  const token = {
    key: tokenData.get('oauth_token')!,
    secret: tokenData.get('oauth_token_secret')!,
  };

  return {
    token,
    appToken: '75',
  } satisfies AuthBase;
});
