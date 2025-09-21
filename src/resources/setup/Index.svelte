<script lang="ts">
  import iconRobot from "@ktibow/iconset-material-symbols/robot-2-rounded";
  import iconCable from "@ktibow/iconset-material-symbols/cable-rounded";
  import iconKey from "@ktibow/iconset-material-symbols/key-rounded";
  import iconStop from "@ktibow/iconset-material-symbols/dangerous-rounded";
  import { Icon, Layer } from "m3-svelte";
  import { now } from "../../lib/utils-now.svelte";
  import Auto from "./Auto.svelte";
  let page = $state("home");
  let autoCountdown: number | undefined = $state(Date.now() + 5000);
  $effect(() => {
    if (page != "home") autoCountdown = undefined;
    if (!autoCountdown) return;
    if (now.getTime() > autoCountdown) {
      page = "auto";
      autoCountdown = undefined;
    }
  });
</script>

{#if autoCountdown}
  {@const seconds = Math.round((autoCountdown - now.getTime()) / 1000)}
  <div class="toast">
    Using auto in {seconds}
    {seconds == 1 ? "second" : "seconds"}
    <button onclick={() => (autoCountdown = undefined)}>
      <Icon icon={iconStop} />
    </button>
  </div>
{/if}

{#if page == "home"}
  <div class="container">
    <p>Set up quick links with Schoology.</p>
    <button onclick={() => (page = "auto")}>
      <Layer />
      <Icon icon={iconRobot} width="1.25rem" height="1.25rem" />
      <p>Full auto</p>
      <p>Secant sets up quick links on your behalf.</p>
    </button>
    <button onclick={() => (page = "3leg")}>
      <Layer />
      <Icon icon={iconCable} width="1.25rem" height="1.25rem" />
      <p>Authorize with Schoology</p>
      <p>Click a few buttons to activate quick links.</p>
    </button>
    <button onclick={() => (page = "key")}>
      <Layer />
      <Icon icon={iconKey} width="1.25rem" height="1.25rem" />
      <p>Authorize with API key</p>
      <p>If you have an API key, you can use it to activate quick links.</p>
    </button>
  </div>
{:else if page == "auto"}
  <Auto />
{/if}

<style>
  .toast {
    display: flex;
    align-items: center;
    height: 2.5rem;
    padding-left: 1rem;
    border-radius: var(--m3-util-rounding-extra-large);
    background-color: rgb(var(--m3-scheme-surface-container-high));

    position: fixed;
    top: 1.5rem;
    left: 50%;
    translate: -50% 0;
    > button {
      display: flex;
      align-items: center;
      align-self: stretch;
      padding-inline: 1rem;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 25rem;
    margin: auto;
    > * {
      padding: 1rem;
      border-radius: var(--m3-util-rounding-medium);
      &:first-child {
        border-start-start-radius: var(--m3-util-rounding-extra-large);
        border-start-end-radius: var(--m3-util-rounding-extra-large);
      }
      &:last-child {
        border-end-start-radius: var(--m3-util-rounding-extra-large);
        border-end-end-radius: var(--m3-util-rounding-extra-large);
      }
      background-color: rgb(var(--m3-scheme-surface-container-low));
    }
    > p {
      text-align: center;
    }
    > button {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      column-gap: 1rem;
      position: relative;
      > :global(svg) {
        grid-row: span 2;
        color: rgb(var(--m3-scheme-secondary));
      }
      > p {
        grid-column: 2;
      }
    }
  }
</style>
