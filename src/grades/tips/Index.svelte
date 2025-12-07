<script lang="ts">
  import type { ClassGrade } from "../lib/types";
  import PercentDone from "./PercentDone.svelte";
  import Warnings from "./Warnings.svelte";
  import { calculateLetter, getPoints, roundTo } from "../lib/utils";
  import { getSemester } from "../lib/semester";

  let {
    categories,
    assignments,
    futureAssignments,
    grade,
    ...extra
  }: ClassGrade & {
    grade: number;
  } = $props();

  const now = new Date();
  const semester = getSemester();
  const done = semester.filter((d) => d.getTime() < now.getTime()).length;
  const total = semester.length;
  const timeBasedProgress = done / total;
  let pointBasedProgress = $derived.by(() => {
    if (!categories) {
      const possible = getPoints(assignments).possible;
      const futurePossible = futureAssignments.reduce((a, b) => a + b.points, 0);
      return possible / (possible + futurePossible);
    }
    let cumulativeProgress = 0;
    for (const [category, { possible, weight }] of Object.entries(categories)) {
      const futurePossible = futureAssignments
        .filter((a) => a.category == category)
        .reduce((a, b) => a + b.points, 0);
      cumulativeProgress += (possible / (possible + futurePossible)) * weight;
    }
    return cumulativeProgress;
  });
  let progress = $derived(
    pointBasedProgress ? Math.min(timeBasedProgress, pointBasedProgress) : timeBasedProgress,
  );

  const calculateXForY = (grade: number, y: number) => {
    const delta = y - progress * grade;
    return delta / (1 - progress);
  };

  let below = $derived.by(() => {
    if (grade < 60) return 40;
    if (grade < 67) return 60;
    if (grade < 70) return 67;
    if (grade < 73) return 70;
    if (grade < 77) return 73;
    if (grade < 80) return 77;
    if (grade < 83) return 80;
    if (grade < 87) return 83;
    if (grade < 90) return 87;
    if (grade < 93) return 90;
    return 93;
  });
  let above = $derived.by(() => {
    if (grade < 60) return 60;
    if (grade < 67) return 67;
    if (grade < 70) return 70;
    if (grade < 73) return 73;
    if (grade < 77) return 77;
    if (grade < 80) return 80;
    if (grade < 83) return 83;
    if (grade < 87) return 87;
    if (grade < 90) return 90;
    if (grade < 93) return 93;
    return undefined;
  });
</script>

<div class="wrapper">
  <PercentDone {progress} />
  {#if grade <= 60}
    <!-- intentionally left blank -->
  {:else if calculateXForY(grade, below) > 40}
    <div class="tip">
      You'll need <abbr
        title="Average {roundTo(calculateXForY(grade, below), 1)}% on future assignments"
        >{roundTo((calculateXForY(grade, below) / grade) * 100, 0)}% effort</abbr
      >
      to keep a {calculateLetter(grade)}
    </div>
  {:else}
    <div class="tip">
      From what we know, your {calculateLetter(grade)} is solid
    </div>
  {/if}
  {#if above && calculateXForY(grade, above) < 100}
    <div class="tip">
      But <abbr title="Average {roundTo(calculateXForY(grade, above), 1)}% on future assignments">
        working {roundTo((calculateXForY(grade, above) - grade) * (100 / grade), 0)}% harder
      </abbr>
      could get you a {calculateLetter(above)}
    </div>
  {/if}
  <Warnings {categories} {assignments} {futureAssignments} {...extra} {grade} />
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem;

    > :global(*) {
      background-color: var(--m3c-surface-container-low);
      padding: 0.5rem;
      border-radius: 1rem;
      flex-grow: 1;
      grid-column: 1 / span 2;
      &:first-child {
        grid-column: 1;
      }
      &:nth-child(2) {
        grid-column: 2;
      }
      &.warning {
        background-color: var(--m3c-error-container);
        color: var(--m3c-on-error-container);
      }
    }
  }
  abbr {
    cursor: help;
  }
</style>
