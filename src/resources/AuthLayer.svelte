<script lang="ts">
  import { getStorage } from "monoidentity";
  import Setup from "./setup/Index.svelte";
  import ClassLayer from "./ClassLayer.svelte";
  import type { Class } from "../combine";

  let { clazz }: { clazz: Class | undefined } = $props();
  const getAuth = () => getStorage("config").schoology;
  let auth = $state(getAuth());
  let clazzId = $derived(clazz?.id);
  let completedAssignments = $derived(clazz?.grade?.assignments.map((a) => a.name) || []);
</script>

{#if !auth}
  <Setup finish={() => (auth = getAuth())} />
{:else if clazzId && auth}
  <ClassLayer {clazzId} {completedAssignments} {auth} />
{/if}
