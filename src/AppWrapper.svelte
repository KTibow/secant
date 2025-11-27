<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import ErrorAlert from "./lib/ErrorAlert.svelte";
  import App from "./App.svelte";
</script>

<Monoidentity
  app="secant"
  intents={[{ loginRecognized: true }]}
  getSyncStrategy={(path) =>
    path.startsWith(".config/secant") ? { mode: "immediate" } : undefined}
>
  <svelte:boundary>
    {#snippet failed(error)}
      <ErrorAlert {error} />
    {/snippet}
    <App />
  </svelte:boundary>
</Monoidentity>
