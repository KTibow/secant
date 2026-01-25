<script lang="ts">
  import { onMount } from "svelte";
  import { getStorage } from "monoidentity";
  import Clock from "./Clock.svelte";
  import ClassPane from "./schedule/ClassPane.svelte";
  import { getSchedule } from "./lib/schedule";
  import { getGrades } from "./lib/grades";
  import loader from "./lib/resources/loader";
  import { combine, type Class } from "./lib/combine";
  import type { ClassGrade, ResourceData } from "./lib/types";

  let schedule = $state<Class[]>([]);
  let grades = $state<ClassGrade[]>([]);
  let resources = $state<Record<string, ResourceData>>({});
  let now = $state(new Date());

  let classes = $derived(
    Object.values(combine(schedule, grades, resources)).sort((a, b) => a.period - b.period),
  );

  $effect(() => {
    console.log("Combined classes:", classes);
  });

  let allGraded = $derived.by(() => {
    const output: Record<string, string[]> = {};
    for (const clazz of classes) {
      if (!clazz.grade || !clazz.id) continue;
      output[clazz.id] = clazz.grade.assignments.map((a) => a.name);
    }
    return output;
  });

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 1000);

    const config = getStorage("config");

    getSchedule().then((data) => {
      console.log("Schedule:", data);
      schedule = data;
    });

    getGrades().then((data) => {
      console.log("Grades:", data);
      grades = data;
    });

    if (config?.schoology) {
      // Pass empty skipSubmittedCheck for now or implement persistence
      loader(config.schoology, {}).then((data) => {
        console.log("Resources:", data);
        resources = data;
      });
    }

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

{#each classes as clazz (clazz.period)}
  <ClassPane {clazz} order={clazz.period} id="period-{clazz.period}" />
{/each}
