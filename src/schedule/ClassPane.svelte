<script lang="ts">
  import Pane from "../lib/Pane.svelte";
  import { ordinal } from "../lib/ordinal";

  let {
    clazz,
    order,
    ...rest
  }: {
    clazz: { name: string; period: number; startTime?: Date; endTime?: Date };
    order: number;
    [key: string]: any;
  } = $props();
</script>

<Pane {order} {...rest}>
  {#snippet status()}
    {clazz.name} • {ordinal(clazz.period)}
  {/snippet}
  <div class="content">
    <h2>{clazz.name}</h2>
    <!-- Placeholder for future content -->
  </div>
</Pane>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1rem;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
  }
</style>
