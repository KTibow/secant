<script lang="ts">
  import { Icon } from "m3-svelte";
  import { onward } from "kreations";
  import { onMount } from "svelte";
  import exchange from "./exchange.remote";
  import { save } from "../../src/resources/setup/save";

  const run = async () => {
    const requestAuthStr = localStorage.requestAuth;
    if (!requestAuthStr) throw new Error("No request auth found");
    const requestAuth = JSON.parse(requestAuthStr);
    const auth = await exchange(requestAuth);
    save(auth);
    location.href = location.origin;
  };
  onMount(() =>
    run().finally(() => {
      delete localStorage.requestAuth;
    }),
  );
</script>

<Icon icon={onward} size={48} />
