<script lang="ts">
  import { Layer, Icon, easeEmphasized } from "m3-svelte";
  import { slide } from "svelte/transition";
  import iconLeft from "@ktibow/iconset-material-symbols/chevron-left-rounded";
  import iconRight from "@ktibow/iconset-material-symbols/chevron-right-rounded";
  import iconDown from "@ktibow/iconset-material-symbols/keyboard-arrow-down-rounded";
  import iconUp from "@ktibow/iconset-material-symbols/keyboard-arrow-up-rounded";
  import { trackCachedAuto } from "./lib/data-tracking";
  import { now } from "./lib/utils-now.svelte";
  import { ordinal } from "./lib/ordinal";
  import { combine } from "./combine";
  import { getGrades } from "./grades";
  import Grades from "./grades/Index.svelte";
  import { recalculateGrade, roundTo } from "./grades/lib/utils";
  import { getSchedule } from "./schedule";

  const schedule = trackCachedAuto({ id: "schedule", loader: getSchedule });
  const grades = trackCachedAuto({ id: "grades", loader: getGrades });
  let classes = $derived(combine($schedule.data, $grades.data));

  let truePeriod = $derived(
    classes?.find((c) => {
      if (!c.startTime || !c.endTime) return false;
      const time = now.getTime();
      const startTime = c.startTime.getTime();
      const endTime = c.endTime.getTime();
      return time >= startTime && time < endTime;
    })?.period,
  );

  let trackedPeriod: number | undefined = $state();
  $effect(() => {
    if (trackedPeriod != truePeriod) {
      trackedPeriod = truePeriod;
      period = truePeriod;
    }
  });

  let period = $state(1);
  let clazz = $derived(classes.find((c) => c.period == period));
  let grade = $derived(clazz?.grade);
  let gradeOpen = $state(false);
  let gradeShown = $derived(gradeOpen ? grade : undefined);
</script>

<div style:flex-grow="1"></div>
{#if clazz}
  {@const prevClass = classes.findLast((c) => c.period < clazz.period)}
  {@const nextClass = classes.find((c) => c.period > clazz.period)}
  <div class="controls">
    <div>
      {clazz.name}
      {#if clazz.period == truePeriod && clazz.endTime}
        <span style:color="rgb(var(--m3-scheme-tertiary))">
          {Math.ceil((new Date(clazz.endTime).getTime() - now.getTime()) / 60000)}
        </span>
      {:else}
        <span style:color="rgb(var(--m3-scheme-on-surface-variant))">
          {ordinal(period)}
        </span>
      {/if}
    </div>
    {#if grade}
      <button class="focus-inset fade tnum" onclick={() => (gradeOpen = !gradeOpen)}>
        <Layer />
        {#if gradeOpen}
          Grade
          <Icon icon={iconDown} />
        {:else if grade}
          {roundTo(recalculateGrade(grade), 1)}%
          <Icon icon={iconUp} />
        {/if}
      </button>
    {/if}
    <button
      class="focus-inset"
      class:fade={prevClass}
      disabled={!prevClass}
      onclick={() => (period = prevClass!.period)}
    >
      <Layer />
      <Icon icon={iconLeft} />
    </button>
    <button
      class="focus-inset"
      class:fade={nextClass}
      disabled={!nextClass}
      onclick={() => (period = nextClass!.period)}
    >
      <Layer />
      <Icon icon={iconRight} />
    </button>
  </div>
{/if}
{#if gradeShown}
  <div class="grade-details tnum" transition:slide={{ duration: 500, easing: easeEmphasized }}>
    <Grades {...gradeShown} />
  </div>
{/if}

<style>
  :global(.fade) {
    background-image: linear-gradient(
      to bottom,
      rgb(var(--m3-scheme-primary-container-subtle) / 1) 0,
      rgb(var(--m3-scheme-primary-container-subtle) / 0.8) calc(var(--gradient-height) * 0.25),
      rgb(var(--m3-scheme-primary-container-subtle) / 0.4) calc(var(--gradient-height) * 0.5),
      rgb(var(--m3-scheme-primary-container-subtle) / 0.2) calc(var(--gradient-height) * 0.75),
      transparent var(--gradient-height)
    );
    color: rgb(var(--m3-scheme-on-primary-container-subtle));
  }

  .controls {
    display: flex;
    height: 3rem;
    gap: 0.25rem;

    > * {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0 1rem;

      transition:
        background-image var(--m3-util-easing),
        color var(--m3-util-easing);
      border-radius: var(--m3-util-rounding-medium);
      pointer-events: auto;
      position: relative;

      --gradient-height: 3rem;
    }
    > :first-child {
      border-start-start-radius: 1.5rem;
    }
    > :last-child {
      border-start-end-radius: 1.5rem;
    }
    > div {
      flex: 1;
    }
    > :disabled {
      color: rgb(var(--m3-scheme-outline-variant));
    }
    > :not(:enabled) {
      outline: solid 2px rgb(var(--m3-scheme-outline-variant));
      outline-offset: -2px;
    }
  }
  .grade-details {
    display: flex;
    @media (width < 40rem) {
      flex-direction: column;
    }
    overflow: auto;
    gap: 0.5rem;
    padding: 0.5rem;
    min-height: clamp(0rem, calc(8dvh + 8rem), 15rem);
  }
</style>
