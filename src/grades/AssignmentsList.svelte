<script lang="ts">
  import { Layer } from "m3-svelte";
  import CategoryRepresentation from "./lib/CategoryRepresentation.svelte";
  import type { ClassGrade } from "./lib/types";
  import { simplifyCategory } from "./lib/naming";
  import { roundTo } from "./lib/utils";

  let { assignments, categories, openSimulator }: ClassGrade & { openSimulator: () => void } =
    $props();

  let hasCategories = $derived(categories && Object.keys(categories).length > 1);
</script>

<div class="list">
  <div class="header">
    <span>
      {assignments.length}
      {assignments.length == 1 ? "assignment" : "assignments"}
    </span>
    <div style:flex-grow="1"></div>
    <button onclick={openSimulator}>
      <Layer />
      Simulate
    </button>
  </div>

  <div class="columns" class:has-categories={hasCategories}>
    {#each assignments as { earned, possible, name, category }, i (i)}
      {#if hasCategories}
        <CategoryRepresentation category={simplifyCategory(category)} />
      {/if}
      <p>{name}</p>
      <p class="points">
        {roundTo(earned, 3)} <span class="slash">/</span>
        <span class:padded={assignments.some((a) => a.possible >= 10)}>{possible}</span>
      </p>
    {/each}
  </div>
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;

    position: absolute;
    inset: 0;
    overflow: auto;
    background-color: rgb(var(--m3-scheme-surface-container-low));
    padding: 0.5rem;
    border-radius: 1rem;
  }
  .header {
    display: flex;
    gap: 0.5rem;
    height: 2rem;
    margin-bottom: 0.5rem;
    flex-shrink: 0;

    > span {
      align-self: center;
    }
    > button {
      display: flex;
      align-items: center;
      padding: 0 0.5rem;
      border-radius: 0.5rem;
      position: relative;

      background-color: rgb(var(--m3-scheme-secondary-container));
      color: rgb(var(--m3-scheme-on-secondary-container));
    }
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-auto-rows: 2rem;
    gap: 0.5rem;
    align-items: center;

    &.has-categories {
      grid-template-columns: 1.5rem 1fr auto;
    }
    > :global(svg) {
      color: rgb(var(--m3-scheme-tertiary));
      justify-self: center;
    }
    > p {
      white-space: nowrap;
      text-overflow: clip;
      overflow: hidden;
    }
    > .points {
      display: flex;
      justify-self: end;
    }
    .slash {
      padding: 0 0.25rem;
    }
    .padded {
      display: flex;
      justify-content: end;
      min-width: 1.5rem;
    }
  }
</style>
