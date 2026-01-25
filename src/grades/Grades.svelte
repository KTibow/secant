<script>
  import Pane from "../lib/Pane.svelte";
</script>

<Pane order={-1}>
  {#snippet status()}
    Grades status
  {/snippet}
  Grades
</Pane>
