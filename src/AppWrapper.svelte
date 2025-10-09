<script lang="ts">
  import Monoidentity from "monoidentity/Monoidentity.svelte";
  import ErrorBoundary from "./lib/ErrorBoundary.svelte";
  import App from "./App.svelte";
</script>

<Monoidentity app="secant" intents={[{ loginRecognized: true }]}>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
</Monoidentity>
