<script lang="ts">
  import { Icon } from "m3-svelte";
  import { onward } from "kreations";
  import exchange from "./exchange.remote";
  import { save } from "../../src/resources/setup/save";
  import ErrorAlert from "../../src/lib/ErrorAlert.svelte";

  const run = async () => {
    const requestAuthStr = localStorage.requestAuth;
    if (!requestAuthStr) throw new Error("No request auth found");
    delete localStorage.requestAuth;

    const requestAuth = JSON.parse(requestAuthStr);
    const auth = await exchange(requestAuth);
    save(auth);
    location.href = location.origin;
  };
</script>

{#await run()}
  <Icon icon={onward} size={48} />
{:catch error}
  <ErrorAlert {error} />
{/await}
