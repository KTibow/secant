<script lang="ts">
  import Monoidentity from "monoidentity/Monoidentity.svelte";
  import App from "./App.svelte";
</script>

<Monoidentity app="secant" scopes={["login-recognized", "storage"]}>
  <App />
</Monoidentity>
