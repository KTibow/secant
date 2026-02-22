<script lang="ts">
  import ErrorAlert from './lib/ErrorAlert.svelte';
  import App from './App.svelte';
</script>

<svelte:boundary>
  {#snippet failed(error)}
    <ErrorAlert {error} />
  {/snippet}
  <App />
</svelte:boundary>
