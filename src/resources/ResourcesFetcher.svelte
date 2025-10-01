<script lang="ts">
  import type { FullAuth } from "../lib/api/schoology";
  import { trackCachedAuto } from "../lib/data-tracking";
  import Viz from "../lib/Viz.svelte";
  import loader from "./loader";
  import Resources from "./Resources.svelte";

  let {
    classPeriod,
    classId,
    allGraded,
    auth,
  }: {
    classPeriod?: number;
    classId?: string;
    allGraded: Record<number, string[]>;
    auth: FullAuth;
  } = $props();

  const resources = trackCachedAuto({
    id: "resources",
    loader: () => loader(auth),
    expireAfter: 1000 * 60 * 10,
  });
  let completedAssignments = $derived((classPeriod && allGraded[classPeriod]) || []);
  let classResources = $derived(classId && $resources.data?.[classId]);
</script>

{#if classResources}
  <Resources {...classResources} {completedAssignments} />
{/if}
<Viz loading={$resources.loading} errored={Boolean($resources.errors.length)} />
