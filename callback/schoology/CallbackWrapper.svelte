<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import Callback from "./Callback.svelte";
</script>

<Monoidentity
  app="secant"
  intents={[{ loginRecognized: true }]}
  getSyncStrategy={(path) =>
    path.startsWith(".config/secant") ? { mode: "immediate" } : undefined}
>
  <Callback />
</Monoidentity>
