<script lang="ts">
  import type { FullAuth } from "../lib/api/schoology";
  import { trackCachedAuto } from "../lib/data-tracking";
  import loader from "./loader";
  import Resources from "./Resources.svelte";
  import Loader from "../lib/Loader.svelte";

  let {
    classPeriod,
    classId,
    allGraded,
    auth,
  }: { classPeriod?: number; classId?: string; allGraded: Record<number, string[]>; auth: FullAuth } = $props();

  const resources = trackCachedAuto({
    id: "resources",
    loader: () => loader(auth),
    expireAfter: 1000 * 60 * 10,
  });
  let classResources = $derived($resources.data?.[classId]);
  let completedAssignments = $derived(allGraded[classPeriod] || []);
</script>

{#if classResources}
  <Resources {...classResources} {completedAssignments} />
{/if}
{#if $resources.loading}
  <Loader />
{/if}
