<script lang="ts">
  import { getStorage } from "monoidentity";
  import type { Class } from "../combine";
  import Setup from "./setup/Index.svelte";
  import { SCHOOLOGY_CONFIG_ENTRY } from "./setup/storage";
  import ResourcesFetcher from "./ResourcesFetcher.svelte";

  let { classes, clazz }: { classes: Record<number, Class>; clazz: Class | undefined } = $props();

  const config = getStorage("config");
  let classId = $derived(clazz?.id);
  let allGraded = $derived.by(() => {
    const output: Record<string, string[]> = {};
    for (const period in classes) {
      const { grade, id } = classes[period];
      if (!grade || !id) continue;
      output[id] = grade.assignments.map((a) => a.name);
    }
    return output;
  });
</script>

{#if !config[SCHOOLOGY_CONFIG_ENTRY]}
  <Setup />
{:else}
  <ResourcesFetcher {classId} {allGraded} auth={config[SCHOOLOGY_CONFIG_ENTRY]} />
{/if}
