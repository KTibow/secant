import { getStorage } from "monoidentity";
import { onMount } from "svelte";
import { get, writable } from "svelte/store";

type Loader<T> = () => Promise<T>;
type Config<T> = {
  initialData?: T;
  initialStale?: boolean;
  expireAfter?: number;
  loader: Loader<T>;
};

const track = <T>({
  initialData = undefined,
  initialStale = true,
  expireAfter = 1000 * 60 * 60 * 12,
  loader,
}: Config<T>) => {
  const data = {
    data: initialData,
    dataAsOf: initialStale ? 0 : Date.now(),
    expireAfter,
    loading: false,
    errors: [] as number[],
    async run() {
      if (data.loading) return;
      if (Date.now() - data.dataAsOf < data.expireAfter) return;
      if (data.errors.length >= 4 && Date.now() - data.errors.at(-1)! < 2000) {
        return;
      }
      if (data.errors.length >= 6 && Date.now() - data.errors.at(-1)! < 10000) {
        return;
      }
      if (data.errors.length >= 8 && Date.now() - data.errors.at(-1)! < 60000) {
        return;
      }

      data.loading = true;
      store.set(data);
      try {
        const result = loader();
        const process = (update: T) => {
          data.data = update;
          data.dataAsOf = Date.now();
          data.errors = [];
          store.set(data);
        };

        process(await result);
      } catch (e) {
        console.error("while updating", e);
        data.errors.push(Date.now());
      } finally {
        data.loading = false;
        store.set(data);
      }
    },
  };
  const store = writable<typeof data>();
  store.set(data);
  return store;
};
type CachedConfig<T> = Omit<Config<T>, "initialData"> & { id: string };
const trackCached = <T>({ id, ...opts }: CachedConfig<T>) => {
  const cache = getStorage("cache");
  const result = track<T>({
    initialData: cache[id],
    ...opts,
  });
  result.subscribe((data) => {
    if (data.data) cache[id] = data.data;
  });
  return result;
};
export const trackCachedAuto = <T>(config: CachedConfig<T>) => {
  const tracked = trackCached(config);
  const run = get(tracked).run;
  onMount(() => {
    run();
    const interval = setInterval(run, 5000);
    return () => clearInterval(interval);
  });
  return tracked;
};
