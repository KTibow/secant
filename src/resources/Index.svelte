<script lang="ts">
  import { getStorage } from "monoidentity";
  import type { Class } from "../combine";
  import Setup from "./setup/Index.svelte";
  import ResourcesFetcher from "./ResourcesFetcher.svelte";

  let { classes, clazz }: { classes: Record<number, Class>; clazz: Class | undefined } = $props();

  const getAuth = () => getStorage("config").schoology;
  let auth = $state(getAuth());
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

{#if !auth}
  <Setup finish={() => (auth = getAuth())} />
{:else}
  <ResourcesFetcher {classId} {allGraded} {auth} />
{/if}
