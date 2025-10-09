<script lang="ts">
  import Monoidentity from "monoidentity/Monoidentity.svelte";
  import ErrorBoundary from "../../src/lib/ErrorBoundary.svelte";
  import Callback from "./Callback.svelte";
</script>

<Monoidentity app="secant" intents={[{ loginRecognized: true }]}>
  <ErrorBoundary>
    <Callback />
  </ErrorBoundary>
</Monoidentity>
