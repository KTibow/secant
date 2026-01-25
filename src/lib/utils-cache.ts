import { getStorage } from "monoidentity";

const cache = getStorage("cache");

export const cacheMonthly =
  <T>(name: string, fn: () => Promise<T>) =>
  async (): Promise<T> => {
    const today = new Date();
    const cacheKey = `${today.getMonth() + 1}/${today.getFullYear()}`;

    const cached = cache[name];
    if (cached?.key == cacheKey) {
      return cached.data;
    }

    const data = await fn();
    cache[name] = { key: cacheKey, data };
    return data;
  };
