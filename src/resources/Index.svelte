<script lang="ts">
  import { getStorage } from "monoidentity";
  import type { Class } from "../combine";
  import Setup from "./setup/Index.svelte";
  import ResourcesFetcher from "./ResourcesFetcher.svelte";

  let { clazz }: { clazz: Class | undefined } = $props();
  const getAuth = () => getStorage("config").schoology;
  let auth = $state(getAuth());
  let clazzId = $derived(clazz?.id);
  let completedAssignments = $derived(clazz?.grade?.assignments.map((a) => a.name) || []);
</script>

{#if !auth}
  <Setup finish={() => (auth = getAuth())} />
{:else if auth && clazzId}
  <ResourcesFetcher {clazzId} {completedAssignments} {auth} />
{/if}
