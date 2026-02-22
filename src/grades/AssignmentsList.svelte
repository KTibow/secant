<script lang="ts">
  import CategoryRepresentation from './lib/CategoryRepresentation.svelte';
  import type { ClassGrade } from './lib/types';
  import { simplifyCategory } from './lib/naming';
  import { roundTo } from './lib/utils';
  import { getTimeBasedProgress, getPointBasedProgress } from './lib/semester';

  let {
    assignments,
    futureAssignments,
    categories,
    openSimulator,
    grade,
  }: ClassGrade & { openSimulator: () => void; grade: number } = $props();

  let hasCategories = $derived(categories && Object.keys(categories).length > 1);

  // Calculate semester progress
  const timeBasedProgress = getTimeBasedProgress();
  let pointBasedProgress = $derived(
    getPointBasedProgress(assignments, futureAssignments, categories),
  );

  const openToss = () => {
    let prompt = '';
    prompt += `the user just hit a "toss" button on secant, tossing their grades in ${categories ? 'a weighted' : 'an unweighted'} class to you. `;
    if (grade < 93)
      prompt += `you're now being connected to the user, so explain how you can analyze them beyond a basic breakdown (secant already let the user view their grade, their composition, and run what-ifs ("simulate")) quick`;
    else
      prompt += `you're now being connected to the user, but it's a bit odd they asked you to analyze them when they're good already and they can already do basic analysis (view grade, its composition, and what-ifs ("simulate")) in secant. maybe explain how you can help with other classes or tasks, or laugh at how they're trying to analyze a ~perfect grade.`;
    prompt += `\n\noverall grade: ${grade}%`;
    prompt += `\n% through the semester (measured by days): ${roundTo(timeBasedProgress * 100, 1)}%`;
    prompt += `\n% through the semester (measured by visible coursework): ${roundTo(pointBasedProgress * 100, 1)}%`;
    if (categories) {
      prompt += `\n\ncategories:`;
      for (const [k, v] of Object.entries(categories)) {
        prompt += `\n${k}: ${JSON.stringify(v)}`;
      }
    }
    prompt += `\n\nall assignments:`;
    prompt += `\n${assignments.map((x) => JSON.stringify(x)).join('\n')}`;
    prompt += `\n${(futureAssignments || []).map((x) => 'future: ' + JSON.stringify(x)).join('\n')}`;
    const encoded = encodeURIComponent(prompt);
    window.open(`https://cosinehq.web.app#q=${encoded}`, '_blank');
  };
</script>

<div class="list">
  <div class="header">
    <span>
      {assignments.length}
      {assignments.length == 1 ? 'assignment' : 'assignments'}
    </span>
    <div style:flex-grow="1"></div>
    <button class="m3-layer" onclick={openToss}> Toss </button>
    <button class="m3-layer" onclick={openSimulator}> Simulate </button>
  </div>

  <div class="columns" class:has-categories={hasCategories}>
    {#each assignments as { earned, possible, ogType, ogScore, name, category }, i (i)}
      {#if hasCategories}
        <CategoryRepresentation category={simplifyCategory(category)} />
      {/if}
      <p>{name}</p>
      <p class="points" title={ogScore ? `Originally ${ogScore} on ${ogType}` : undefined}>
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
    background-color: var(--m3c-surface-container-low);
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

      background-color: var(--m3c-secondary-container);
      color: var(--m3c-on-secondary-container);
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
      color: var(--m3c-tertiary);
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
      &[title] {
        text-decoration: underline;
        text-decoration-style: dotted;
        cursor: help;
      }
    }
  }
  .slash {
    padding: 0 0.25rem;
  }
  .padded {
    display: flex;
    justify-content: end;
    min-width: 1.5rem;
  }
</style>
