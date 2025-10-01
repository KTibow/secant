<script lang="ts">
  import iconError from "@ktibow/iconset-material-symbols/error-outline-rounded";
  import { triangleSquare } from "kreations";
  import { Icon } from "m3-svelte";

  let { loading, errored }: { loading: boolean; errored: boolean } = $props();
</script>

{#if loading || errored}
  <Icon
    icon={loading ? triangleSquare : iconError}
    size={24}
    style="position:fixed;top:0.5rem;right:0.5rem;background-color:rgb(var(--m3-scheme-{errored
      ? 'error-container'
      : 'primary-container-subtle'}));color:rgb(var(--m3-scheme-{errored
      ? 'on-error-container'
      : 'on-primary-container-subtle'}));border-radius:var(--m3-util-rounding-extra-small)"
  />
{/if}
