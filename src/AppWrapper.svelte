<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import ErrorAlert from "./lib/ErrorAlert.svelte";
  import App from "./App.svelte";
</script>

<Monoidentity
  app="secant"
  intents={[{ loginRecognized: true }]}
  getSyncStrategy={(path) =>
    path.startsWith(".config/secant/") || path.startsWith(".core/")
      ? { mode: "immediate" }
      : undefined}
>
  <svelte:boundary>
    {#snippet failed(error)}
      <ErrorAlert {error} />
    {/snippet}
    <div class="app">
      <App />
    </div>
  </svelte:boundary>
</Monoidentity>

<style>
  :global(body) {
    display: grid;
    grid-template-rows: 100dvh;
  }
  .app {
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: auto hidden;
    scroll-snap-type: x mandatory;
  }
</style>
