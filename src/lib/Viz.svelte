<script lang="ts">
  import iconError from '@ktibow/iconset-material-symbols/error-outline-rounded';
  import { triangleSquare } from 'kreations';
  import { Icon } from 'm3-svelte';

  let { loading, errored }: { loading: boolean; errored: boolean } = $props();
</script>

{#if loading || errored}
  <Icon
    icon={loading ? triangleSquare : iconError}
    size={24}
    style="position:fixed;top:0.5rem;right:0.5rem;background-color:var(--m3c-{errored
      ? 'error-container'
      : 'primary-container-subtle'});color:var(--m3c-{errored
      ? 'on-error-container'
      : 'on-primary-container-subtle'});border-radius:var(--m3-shape-extra-small)"
  />
{/if}
