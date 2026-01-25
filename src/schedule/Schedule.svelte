<script>
  import Pane from "../lib/Pane.svelte";
</script>

<Pane order={0}>
  {#snippet status()}
    Schedule status
  {/snippet}
  Schedule
</Pane>
