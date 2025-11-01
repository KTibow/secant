<script lang="ts">
  import type { Class } from "../combine";
  import TeacherInfoFetcher from "./TeacherInfoFetcher.svelte";

  let { classes, clazz }: { classes: Record<number, Class>; clazz: Class | undefined } = $props();

  let teachers: string[] = $state([]);

  $effect(() => {
    const set = new Set<string>();
    for (const period in classes) {
      const teacher = classes[period].teacher;
      if (teacher) set.add(teacher);
    }
    const list = Array.from(set).sort();
    if (JSON.stringify(list) != JSON.stringify(teachers)) {
      teachers = list;
    }
  });
</script>

{#if teachers.length}
  {#key teachers}
    <TeacherInfoFetcher {teachers} teacher={clazz?.teacher} />
  {/key}
{/if}
