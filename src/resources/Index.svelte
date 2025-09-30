<script lang="ts">
  import { getStorage } from "monoidentity";
  import type { Class } from "../combine";
  import Setup from "./setup/Index.svelte";
  import ResourcesFetcher from "./ResourcesFetcher.svelte";

  let { classes, clazz }: { classes: Record<number, Class>; clazz: Class | undefined } = $props();
  const getAuth = () => getStorage("config").schoology;
  let auth = $state(getAuth());
  let classPeriod = $derived(clazz?.period);
  let classId = $derived(clazz?.id);
  let allGraded = $derived.by(() => {
    const output: Record<number, string[]> = {};
    for (const period in classes) {
      output[period] = classes[period].grade?.assignments.map((a) => a.name);
    }
    return output;
  });
</script>

{#if !auth}
  <Setup finish={() => (auth = getAuth())} />
{:else}
  <ResourcesFetcher {classPeriod} {classId} {allGraded} {auth} />
{/if}
