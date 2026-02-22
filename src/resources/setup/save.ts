import { getStorage } from 'monoidentity';
import type { FullAuth } from '../../lib/api/schoology';
import { SCHOOLOGY_CONFIG_ENTRY } from './storage';

export const save = (auth: FullAuth) => {
  const storage = getStorage('config');
  storage[SCHOOLOGY_CONFIG_ENTRY] = auth;
};
