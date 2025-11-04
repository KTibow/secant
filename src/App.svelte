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
  import { recalculateGrade, roundTo } from "./grades/lib/utils";
  import { getSchedule } from "./schedule";
  import Resources from "./resources/Index.svelte";
  import TeacherInfo from "./schedule/TeacherInfoWrapper.svelte";
  import Grades from "./grades/Index.svelte";
  import Viz from "./lib/Viz.svelte";

  const schedule = trackCachedAuto({ id: "schedule", loader: getSchedule });
  const grades = trackCachedAuto({ id: "grades", loader: getGrades, expireAfter: 1000 * 60 * 60 });
  let classes = $derived(combine($schedule.data, $grades.data));
  let classesList = $derived(Object.values(classes).sort((a, b) => a.period - b.period));

  let truePeriod = $derived(
    classesList.find((c) => {
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
      if (truePeriod) period = truePeriod;
    }
  });

  let period = $state(1);
  let prevClass = $derived(classesList.findLast((c) => c.period < period));
  let nextClass = $derived(classesList.find((c) => c.period > period));
  let clazz = $derived(classes[period]);
  let grade = $derived(clazz?.grade);
  let gradeOpen = $state(false);
  let gradeShown = $derived(gradeOpen ? grade : undefined);
</script>

<svelte:window
  onkeydown={({ key, target }) => {
    if (!(target instanceof Element)) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName || "")) return;

    if (key == "ArrowLeft") {
      const prevPeriod = prevClass?.period || classesList.at(-1)?.period;
      if (prevPeriod) period = prevPeriod;
    } else if (key == "ArrowRight") {
      const nextPeriod = nextClass?.period || classesList[0]?.period;
      if (nextPeriod) period = nextPeriod;
    }
  }}
/>
<div class="resources">
  <Resources {classes} {clazz} />
</div>
<TeacherInfo {classes} {clazz} />
{#if clazz}
  {@const active = clazz.period == truePeriod}
  {#snippet content()}
    <div class="content">
      {clazz.name}
      {#if active && clazz.endTime}
        <span style:color="rgb(var(--m3-scheme-tertiary))">
          {Math.ceil((clazz.endTime.getTime() - now.getTime()) / 60000)}
        </span>
      {:else}
        <span style:opacity="0.6">
          {ordinal(period)}
        </span>
      {/if}
    </div>
  {/snippet}
  <div class="controls">
    <button
      class="focus-inset"
      class:fade={prevClass}
      disabled={!prevClass}
      onclick={() => (period = prevClass!.period)}
    >
      <Layer />
      <Icon icon={iconLeft} />
    </button>
    {#if grade}
      <button class="focus-inset fade main" class:active onclick={() => (gradeOpen = !gradeOpen)}>
        <Layer />
        {@render content()}
        <div class="grade">
          {#if gradeOpen}
            Grade
            <Icon icon={iconDown} />
          {:else if grade}
            <span class="tnum">{roundTo(recalculateGrade(grade), 1)}%</span>
            <Icon icon={iconUp} />
          {/if}
        </div>
      </button>
    {:else}
      <div class="main" class:active>
        {@render content()}
      </div>
    {/if}
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
<Viz
  loading={$schedule.loading || $grades.loading}
  errored={Boolean($schedule.errors.length + $grades.errors.length)}
/>

<style>
  :global(.fade) {
    --fade-color: var(--m3-scheme-primary-container-subtle);
    background-image: linear-gradient(
      to bottom,
      rgb(var(--fade-color) / 1) 0,
      rgb(var(--fade-color) / 0.8) calc(var(--gradient-height) * 0.25),
      rgb(var(--fade-color) / 0.4) calc(var(--gradient-height) * 0.5),
      rgb(var(--fade-color) / 0.2) calc(var(--gradient-height) * 0.75),
      transparent var(--gradient-height)
    );
    color: rgb(var(--m3-scheme-on-primary-container-subtle));
  }

  .resources {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }
  .controls {
    display: flex;
    height: 3rem;
    gap: 0.25rem;

    > * {
      display: flex;
      align-items: center;
      padding: 0 1rem;

      transition:
        background-image var(--m3-util-easing),
        color var(--m3-util-easing),
        border-radius var(--m3-util-easing-fast);
      border-radius: var(--m3-util-rounding-medium);
      &.active {
        --fade-color: var(--m3-scheme-tertiary-container-subtle);
        color: rgb(var(--m3-scheme-on-tertiary-container-subtle));
      }
      &:first-child {
        border-start-start-radius: 1.5rem;
      }
      &:last-child {
        border-start-end-radius: 1.5rem;
      }
      &:active:enabled {
        border-radius: var(--m3-util-rounding-small);
      }
      &:first-child:enabled {
        border-end-start-radius: 0;
      }
      &:last-child:enabled {
        border-end-end-radius: 0;
      }
      position: relative;

      --gradient-height: 3rem;
    }
    > .main {
      display: grid;
      @media (width < 40rem) {
        grid-template-columns: 1fr auto;
      }
      @media (width >= 40rem) {
        grid-template-columns: 1fr auto 1fr;
        .content {
          grid-column: 2;
        }
        .grade {
          grid-column: 3;
        }
      }
      > * {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      > .grade {
        justify-self: end;
        gap: 0.25rem;
        margin-right: -0.5rem;
      }
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
