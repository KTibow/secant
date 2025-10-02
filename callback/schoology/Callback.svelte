<script lang="ts">
  import { Icon } from "m3-svelte";
  import { onward } from "kreations";
  import { onMount } from "svelte";
  import exchange from "./exchange.remote";
  import { save } from "../../src/resources/setup/save";

  let errored = $state(false);

  const run = async () => {
    const requestAuthStr = sessionStorage.requestAuth;
    if (!requestAuthStr) throw new Error("No request auth found");
    const requestAuth = JSON.parse(requestAuthStr);
    const auth = await exchange(requestAuth);
    save(auth);
    location.href = location.origin;
  };
  onMount(() =>
    run()
      .catch((e) => {
        console.error(e);
        errored = true;
      })
      .finally(() => {
        delete sessionStorage.requestAuth;
      }),
  );
</script>

{#if !errored}
  <Icon icon={onward} size={48} />
{:else}
  <p>Something went wrong</p>
{/if}
