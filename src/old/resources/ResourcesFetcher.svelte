<script lang="ts">
  import type { FullAuth } from "../lib/api/schoology";
  import { trackCachedAuto } from "../lib/data-tracking";
  import Viz from "../lib/Viz.svelte";
  import loader from "./loader";
  import Resources from "./Resources.svelte";

  let {
    classId,
    allGraded,
    auth,
  }: {
    classId?: string;
    allGraded: Record<string, string[]>;
    auth: FullAuth;
  } = $props();

  const resources = trackCachedAuto({
    id: "resources",
    loader: () => loader(auth, allGraded),
    expireAfter: 1000 * 60 * 10,
  });
  let completedAssignments = $derived((classId && allGraded[classId]) || []);
  let classResources = $derived(classId && $resources.data?.[classId]);
</script>

{#if classResources}
  <Resources {...classResources} {completedAssignments} />
{/if}
<Viz loading={$resources.loading} errored={Boolean($resources.errors.length)} />
