<script lang="ts">
  import { triangleSquare } from "kreations";
  import { Icon } from "m3-svelte";
  import type { FullAuth } from "../lib/api/schoology";
  import { trackCachedAuto } from "../lib/data-tracking";
  import loader from "./loader";
  import Resources from "./Resources.svelte";

  let {
    clazzId,
    completedAssignments,
    auth,
  }: { clazzId: string; completedAssignments: string[]; auth: FullAuth } = $props();

  const resources = trackCachedAuto({
    id: "resources",
    loader: () => loader(auth),
    expireAfter: 1000 * 60 * 10,
  });
  let classResources = $derived.by(() => $resources.data?.[clazzId]);
</script>

{#if classResources}
  <Resources {...classResources} {completedAssignments} />
{:else if $resources.loading}
  <Icon icon={triangleSquare} size={48} style="margin:auto" />
{/if}
