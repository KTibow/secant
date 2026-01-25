<script lang="ts">
  import { onMount } from "svelte";

  let { schedule = [] }: { schedule?: { startTime?: Date; endTime?: Date }[] } = $props();

  let now = $state(new Date());

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 1000);
    return () => clearInterval(interval);
  });

  let currentClass = $derived(
    schedule.find((c) => c.startTime && c.endTime && now >= c.startTime && now < c.endTime),
  );

  let displayText = $derived.by(() => {
    if (currentClass && currentClass.endTime) {
      const diff = Math.ceil((currentClass.endTime.getTime() - now.getTime()) / 60000);
      return `${diff} min`;
    }
    return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  });
</script>

<div class="clock">
  {displayText}
</div>

<style>
  .clock {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    grid-row: 1;
    position: sticky;
    left: 0;
    z-index: 100;
  }
</style>
