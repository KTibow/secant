<script lang="ts">
  import Pane from "../lib/Pane.svelte";
  import { ordinal } from "../lib/ordinal";

  import type { Class } from "../lib/combine";

  let {
    clazz,
    order,
    ...rest
  }: {
    clazz: Class;
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
    {#if clazz.grade?.reportedGrade !== undefined}
      <div class="grade">{clazz.grade.reportedGrade}%</div>
    {/if}
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
  .grade {
    font-size: 4rem;
    font-weight: 300;
    color: var(--m3c-primary);
  }
</style>
