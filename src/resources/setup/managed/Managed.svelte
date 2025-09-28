<script lang="ts">
  import { Button, Icon } from "m3-svelte";
  import { onward } from "kreations";
  import { onMount } from "svelte";
  import { decode, retrieveVerification } from "monoidentity";
  import { save } from "../save";
  import autoAuth from "./auto.remote";
  import start from "./start.remote";

  let { finish }: { finish: () => void } = $props();
  let isLoading = $state(true);
  let schoologyLink = $state("");

  const run = async () => {
    const verification = await retrieveVerification();
    const auth = await autoAuth(verification);
    if (auth) {
      save(auth);
      finish();
    } else {
      const requestAuth = await start();
      sessionStorage.requestAuth = JSON.stringify(requestAuth);
      schoologyLink = `https://nsd.schoology.com/oauth/authorize?oauth_token=${decode(requestAuth.token.key)}&oauth_callback=${encodeURIComponent("usesecant.web.app/callback/schoology")}`;
    }
  };
  onMount(() =>
    run().finally(() => {
      isLoading = false;
    }),
  );
</script>

{#if schoologyLink}
  <Button href={schoologyLink}>Connect quick links</Button>
{:else if isLoading}
  <Icon icon={onward} size={48} />
{:else}
  <p>Something went wrong</p>
{/if}
