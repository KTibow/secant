<script lang="ts">
  import { Button } from 'm3-svelte';
  import Auto from './auto/Index.svelte';
  import Key from './Key.svelte';
  import { SCHOOLOGY_REQUEST_AUTH_STORAGE } from './storage';
  import startOAuth from './startoauth.remote';

  let autoing = $state(true);

  let loadingOauth = $state(false);
  let oauthLink = $state('');

  const getOauthLink = async () => {
    const requestAuth = await startOAuth();
    localStorage[SCHOOLOGY_REQUEST_AUTH_STORAGE] = JSON.stringify(requestAuth);

    let hostname = location.hostname;
    if (hostname == 'localhost') hostname = '[::1]';

    return `https://nsd.schoology.com/oauth/authorize?oauth_token=${requestAuth.token.key}&oauth_callback=${encodeURIComponent(`${hostname}/callback/schoology`)}`;
  };

  const preloadOauth = () => {
    if (oauthLink || loadingOauth) return;

    loadingOauth = true;
    getOauthLink()
      .then((link) => {
        oauthLink = link;
      })
      .finally(() => {
        loadingOauth = false;
      });
  };
</script>

{#if autoing}
  <Auto fail={() => (autoing = false)} />
{:else}
  {#if oauthLink}
    <Button href={oauthLink} style="margin:auto">Connect quick links</Button>
  {:else}
    <Button
      onmouseenter={preloadOauth}
      ontouchstart={preloadOauth}
      disabled={loadingOauth}
      style="margin:auto"
    >
      Connect quick links
    </Button>
  {/if}
  <p class="info">
    You can also
    <button class="link" commandfor="manual-key-dialog" command="show-modal">
      add API keys manually
    </button>.
  </p>
  <Key />
{/if}

<style>
  .info {
    @apply --m3-body-medium;
    margin-block: 0.5rem;
    opacity: 0.8;
  }

  .link {
    color: var(--m3c-primary);
    cursor: pointer;
  }
</style>
