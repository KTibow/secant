<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import App from "./App.svelte";
</script>

<Monoidentity app="secant" scopes={["login-recognized", "storage"]}>
  <App />
</Monoidentity>
