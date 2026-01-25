<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    status,
    order,
    ...rest
  }: {
    children: Snippet;
    status: Snippet;
    order: number;
    [key: string]: any;
  } = $props();
</script>

<div class="pane" style:order {...rest}>
  <div class="content">{@render children()}</div>
  <div class="status">{@render status()}</div>
</div>

<style>
  .pane {
    display: grid;
    grid-template-rows: 1fr 3rem;

    width: 100dvw;

    grid-row: 2;
    scroll-snap-align: center;
    overflow: hidden;
  }
  .content {
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding-inline: 3rem;
  }
  .status {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
