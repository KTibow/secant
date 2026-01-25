<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    status,
    order,
  }: {
    children: Snippet;
    status: Snippet;
    order: number;
  } = $props();
</script>

<div class="pane" style:order>
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
