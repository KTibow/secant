<script lang="ts">
  import { Button, Icon } from "m3-svelte";
  import { onward } from "kreations";
  import { decode, retrieveVerification } from "monoidentity";
  import { save } from "../save";
  import autoAuth from "./auto.remote";
  import start from "./start.remote";

  const run = async () => {
    const verification = await retrieveVerification();
    const auth = await autoAuth(verification);
    if (auth) {
      save(auth);
      return;
    } else {
      const requestAuth = await start();
      localStorage.requestAuth = JSON.stringify(requestAuth);

      let hostname = location.hostname;
      if (hostname == "localhost") hostname = "[::1]";
      return `https://nsd.schoology.com/oauth/authorize?oauth_token=${decode(requestAuth.token.key)}&oauth_callback=${encodeURIComponent(`${hostname}/callback/schoology`)}`;
    }
  };

  const promise = run();
</script>

{#await promise}
  <Icon icon={onward} size={48} />
{:then schoologyLink}
  {#if schoologyLink}
    <Button href={schoologyLink}>Connect quick links</Button>
  {/if}
{:catch error}
  {@const message = error instanceof Error ? error.message : String(error)}
  <p>Something went wrong</p>
  <pre>{message}</pre>
{/await}
