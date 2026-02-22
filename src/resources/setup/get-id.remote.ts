import { fn } from 'monoserve';
import { createSchoology, authBase } from '../../lib/api/schoology';
export default fn(authBase, async (auth) => {
  const schoology = createSchoology(auth);
  const response = await schoology(new Request('https://api.schoology.com/v1/users/me'));

  return { id: response.id as number };
});
