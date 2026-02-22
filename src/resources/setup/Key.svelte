<script lang="ts">
  import iconExternal from '@ktibow/iconset-material-symbols/arrow-outward-rounded';
  import { Button, Icon } from 'm3-svelte';
  import { save } from './save';
  import getId from './get-id.remote';
  import type { AuthBase } from '../../lib/api/schoology';

  let key = $state('');
  let secret = $state('');
  let secretEl: HTMLInputElement | undefined = $state();
  let loading = $state(false);
  let error = $state('');

  const submit = async (e?: SubmitEvent) => {
    e?.preventDefault();
    if (loading || !key || !secret) return;
    loading = true;
    error = '';

    const authBase: AuthBase = {
      token: { key, secret },
      appToken: 'token',
    };

    try {
      // Enrich
      const { id } = await getId(authBase);
      save({ ...authBase, userId: id });
    } catch (submitError) {
      error = submitError instanceof Error ? submitError.message : String(submitError);
    } finally {
      loading = false;
    }
  };
</script>

<dialog id="manual-key-dialog" closedby="any">
  <form onsubmit={submit}>
    <a href="https://nsd.schoology.com/api" target="_blank" rel="noreferrer">
      <Icon icon={iconExternal} size={20} />
      Get key
    </a>
    <!-- svelte-ignore a11y_autofocus -->
    <input
      placeholder="Key"
      bind:value={key}
      autofocus
      required
      disabled={loading}
      onpaste={() => setTimeout(() => secretEl?.focus())}
    />
    <input
      placeholder="Secret"
      bind:value={secret}
      bind:this={secretEl}
      required
      disabled={loading}
      onpaste={() => setTimeout(submit)}
    />
    <Button type="submit" disabled={loading || !key || !secret}>
      {loading ? 'Saving...' : 'Use key'}
    </Button>
    {#if error}
      <p class="error">{error}</p>
    {/if}
  </form>
</dialog>

<style>
  dialog {
    flex-direction: column;
    gap: 0.75rem;
    background-color: var(--m3c-surface-container);
    border-radius: 1.5rem;
    width: min(24rem, calc(100dvw - 2rem));
    margin: auto;
    padding: 1rem;
  }
  dialog:open {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  form {
    display: contents;
  }
  a {
    @apply --m3-body-medium;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    color: var(--m3c-primary);
  }
  input {
    @apply --m3-focus-inward;
    height: 3rem;
    padding-inline: 0.75rem;
    background: var(--m3c-surface-container-low);
    border-radius: var(--m3-shape-medium);
  }
  .error {
    @apply --m3-body-small;
    color: var(--m3c-error);
  }
</style>
