<script lang="ts">
  import Inner from "./Inner.svelte";
  import Slider from "./Slider.svelte";
  import { type Assignment } from "../lib/types";

  let {
    assignments,
    futureAssignments,
    grade,
  }: {
    assignments: Assignment[];
    futureAssignments: {
      points: number;
    }[];
    grade: number;
  } = $props();

  let points = $state(10);
  const getQuickOptions = (futureAssignments: { points: number }[]) => {
    const ideas = new Set(futureAssignments.map((a) => a.points));

    return Array.from(ideas)
      .sort((a, b) => a - b)
      .slice(0, 4);
  };

  let { fixedPercent, variablePercent } = $derived.by(() => {
    const acc = { earned: 0, possible: 0 };
    for (const assignment of assignments) {
      acc.earned += assignment.earned;
      acc.possible += assignment.possible;
    }

    return {
      fixedPercent: acc.earned / (acc.possible + points),
      variablePercent: points / (acc.possible + points),
    };
  });
</script>

<Slider bind:points quickOptions={getQuickOptions(futureAssignments)} />
<Inner currentPercent={grade / 100} {fixedPercent} {variablePercent} />
