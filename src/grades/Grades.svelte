<script lang="ts">
  import Pane from "../lib/Pane.svelte";
  import { getGrades } from "../lib/grades";
  import type { ClassGrade } from "../lib/types";

  let grades = $state<ClassGrade[]>([]);

  // TODO: Handle loading/error states properly
  getGrades().then((data) => {
    grades = data;
  });
</script>

<Pane order={-1}>
  {#snippet status()}
    Grades
  {/snippet}

  <div class="grades-list">
    {#each grades as grade}
      <div class="grade-item">
        <span class="period">{grade.period}</span>
        <span class="name">{grade.title}</span>
        <span class="score">{grade.reportedGrade ?? "--"}%</span>
      </div>
    {/each}
  </div>
</Pane>

<style>
  .grades-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
  }
  .grade-item {
    display: grid;
    grid-template-columns: 2rem 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--m3c-surface-container);
    border-radius: 1rem;
  }
  .period {
    color: var(--m3c-on-surface-variant);
    font-weight: bold;
    text-align: center;
  }
  .name {
    font-weight: 500;
  }
  .score {
    font-variant-numeric: tabular-nums;
    font-weight: bold;
    color: var(--m3c-primary);
  }
</style>
