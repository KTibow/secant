<script lang="ts">
  import { Icon } from "m3-svelte";
  import { m3Indicator } from "kreations";
  import { onMount } from "svelte";
  import exchange from "./exchange.remote";
  import { save } from "../../src/resources/setup/save";
  import { decode } from "monoidentity";

  let errored = $state(false);

  const run = async () => {
    const requestAuth = JSON.parse(sessionStorage.requestAuth);
    const auth = await exchange(requestAuth);
    await save(auth);
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
  <Icon icon={m3Indicator} size={48} style="margin:auto" />
{:else}
  <p style:margin="auto">Something went wrong</p>
{/if}
