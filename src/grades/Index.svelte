<script lang="ts">
  import Grade from "./Grade.svelte";
  import Tips from "./tips/Index.svelte";
  import GradeBar from "./GradeBar.svelte";
  import GradeDetails from "./GradeDetails.svelte";
  import Missing from "./Missing.svelte";
  import AssignmentsList from "./AssignmentsList.svelte";
  import Simulator from "./simulator/Index.svelte";
  import type { ClassGrade } from "./lib/types";
  import { recalculateGrade } from "./lib/utils";
  import { originals } from ".";

  let clazz: ClassGrade = $props();
  $effect(() => console.log($state.snapshot(clazz), originals[clazz.period]));
  let grade = $derived(recalculateGrade(clazz));

  let dialogRef: { open: () => void } | null = null;
</script>

<div class="column">
  <Grade {grade} />
  <Tips {...clazz} {grade} />
</div>
{#if clazz.assignments.length > 1}
  <div
    class="column"
    class:categories={clazz.categories}
    class:no-categories={!clazz.categories}
    style:flex-grow="1"
  >
    <GradeBar {...clazz} />
    <GradeDetails {...clazz} />
  </div>
{:else}
  <div style:flex-grow="1"></div>
{/if}
{#if clazz.assignments.some((a) => a.missing)}
  <Missing {...clazz} {grade} />
{/if}
<div class="list-wrapper">
  <AssignmentsList {...clazz} openSimulator={() => dialogRef?.open()} />
</div>
<Simulator bind:this={dialogRef} {...clazz} {grade} />

<style>
  .column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &.categories {
      display: grid;
      grid-template-rows: 1rem 1fr;
    }
    &.no-categories {
      display: grid;
      grid-template-rows: 1fr auto;
    }
    @media (width >= 40rem) {
      min-width: 25rem;
      flex-shrink: 0;
    }
  }
  .list-wrapper {
    position: relative;
    flex: 0;
    @media (width < 40rem) {
      flex-basis: 10rem;
    }
    @media (width >= 40rem) {
      flex-basis: 25rem;
    }
  }
</style>
