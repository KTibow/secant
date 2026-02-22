<script lang="ts">
  import { Monoidentity } from 'monoidentity';
  import ErrorAlert from './lib/ErrorAlert.svelte';
  import App from './App.svelte';
</script>

<Monoidentity intents={[{ loginRecognized: true }]}>
  <svelte:boundary>
    {#snippet failed(error)}
      <ErrorAlert {error} />
    {/snippet}
    <App />
  </svelte:boundary>
</Monoidentity>
