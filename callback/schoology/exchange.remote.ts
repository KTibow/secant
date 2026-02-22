import { fn } from 'monoserve';
import { authBase, createSchoology, type FullAuth } from '../../src/lib/api/schoology';

export default fn(authBase, async (auth) => {
  let schoology = createSchoology(auth);
  const tokenRaw = await schoology(new Request('https://api.schoology.com/v1/oauth/access_token'));
  const tokenData = new URLSearchParams(tokenRaw);

  auth = {
    token: {
      key: tokenData.get('oauth_token')!,
      secret: tokenData.get('oauth_token_secret')!,
    },
    appToken: '75',
  };
  schoology = createSchoology(auth);
  const me = await schoology(new Request('https://api.schoology.com/v1/users/me'));

  return { ...auth, userId: me.id } satisfies FullAuth;
});
