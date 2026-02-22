<script lang="ts">
  import { Monoidentity } from 'monoidentity';
  import Callback from './Callback.svelte';
</script>

<Monoidentity intents={[{ loginRecognized: true }]}>
  <Callback />
</Monoidentity>
