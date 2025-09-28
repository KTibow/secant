<script lang="ts">
  import Monoidentity from "monoidentity/Monoidentity.svelte";
  import Callback from "./Callback.svelte";
</script>

<Monoidentity app="secant" intents={[{ loginRecognized: true }]}>
  <Callback />
</Monoidentity>
