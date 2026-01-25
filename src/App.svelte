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
  import { simplifyClassName } from "./lib/naming";

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
      loader(config.schoology, {}).then(({ resources: resData, sections }) => {
        console.log("Raw Resources:", resData);
        console.log("Schoology Sections:", sections);

        // Map resources to StudentVue IDs using fuzzy matching if necessary
        const mappedResources: Record<string, ResourceData> = {};

        if (schedule.length > 0) {
          for (const section of sections) {
            const schoologyKey = section.section_school_code;
            const resource = resData[schoologyKey];
            if (!resource) continue;

            // 1. Direct match
            let match = schedule.find((c) => c.id === schoologyKey);

            // 2. Fuzzy Title match
            if (!match) {
              const simplifiedSchoologyTitle = simplifyClassName(section.course_title);
              match = schedule.find((c) => c.name === simplifiedSchoologyTitle);
            }

            if (match && match.id) {
              mappedResources[match.id] = resource;
            }
          }
        } else {
          // If schedule isn't loaded yet, we can't map reliably, or we use what we have
          // Ideally schedule loads fast. For now, just use raw if no mapping possible?
          // combine() uses id lookup. If keys don't match, it won't work.
          // We'll update resources once schedule loads?
          // But schedule promise runs parallel.
          // We need a derived or effect to map resources when both are available?
          // Simplified: Just assign mappedResources. If schedule updates later, we might miss it.
          // Actually, we should map inside a derived or when both are ready.
          // But since `loader` is async and `getSchedule` is async, we can't easily wait.
          // Better: Store raw resources and raw sections, and map them in a derived.
        }
        // For this "first attempt", let's assume schedule loads fast or re-run mapping?
        // Actually, let's use a separate state for raw resources and map in derived.
        rawResources = resData;
        schoologySections = sections;
      });
    }

    return () => clearInterval(interval);
  });

  let rawResources = $state<Record<string, ResourceData>>({});
  let schoologySections = $state<any[]>([]);

  // Reactive mapping
  $effect(() => {
    if (schedule.length > 0 && schoologySections.length > 0) {
      const mapped: Record<string, ResourceData> = {};
      for (const section of schoologySections) {
        const schoologyKey = section.section_school_code;
        const resource = rawResources[schoologyKey];
        if (!resource) continue;

        let match = schedule.find((c) => c.id === schoologyKey);
        if (!match) {
          const simplifiedSchoologyTitle = simplifyClassName(section.course_title);
          match = schedule.find((c) => c.name === simplifiedSchoologyTitle);
        }

        if (match && match.id) {
          mapped[match.id] = resource;
        }
      }
      resources = mapped;
      console.log("Mapped Resources:", mapped);
    }
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
