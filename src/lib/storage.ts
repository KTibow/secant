import { stringify, parse } from "devalue";

// Big TODO: make this use monoidentity when it launches

export const getStorage = () => localStorage;
export const getCache = () =>
  new Proxy({} as Record<string, any>, {
    get(_, key: string) {
      const storage = getStorage();
      const cacheKey = `.cache/${key}`;
      const item = storage[cacheKey];
      if (!item) return undefined;
      try {
        return parse(item);
      } catch {
        return undefined;
      }
    },
    set(_, key: string, value: unknown) {
      const storage = getStorage();
      const cacheKey = `.cache/${key}`;
      storage[cacheKey] = stringify(value);
      return true;
    },
  });
