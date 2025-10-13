<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import Callback from "./Callback.svelte";
</script>

<Monoidentity
  app="secant"
  intents={[{ loginRecognized: true }]}
  shouldBackup={(path) => path.startsWith(".core") || path.startsWith(".config/secant")}
>
  <Callback />
</Monoidentity>
