<script lang="ts">
  import { onMount } from "svelte";
  import Clock from "./Clock.svelte";
  import Grades from "./grades/Grades.svelte";
  import ClassPane from "./schedule/ClassPane.svelte";
  import { getSchedule } from "./lib/schedule";

  let classes = $state<
    { name: string; period: number; id: string; startTime?: Date; endTime?: Date }[]
  >([]);
  let now = $state(new Date());

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 1000);

    getSchedule().then((data) => {
      classes = data;
    });

    return () => clearInterval(interval);
  });

  let activePeriod = $derived.by(() => {
    if (classes.length === 0) return null;

    // Check for current class
    const current = classes.find(
      (c) => c.startTime && c.endTime && now >= c.startTime && now < c.endTime,
    );
    if (current) return current.period;

    // Check for next class
    const next = classes.find((c) => c.startTime && now < c.startTime);
    if (next) return next.period;

    // If late in the day, show last class
    const last = classes.at(-1);
    if (last && last.endTime && now >= last.endTime) return last.period;

    return classes[0].period;
  });

  $effect(() => {
    if (activePeriod !== null) {
      const el = document.getElementById(`period-${activePeriod}`);
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
</script>

<Clock schedule={classes} />
<Grades />

{#each classes as clazz (clazz.period)}
  <ClassPane {clazz} order={clazz.period} id="period-{clazz.period}" />
{/each}
