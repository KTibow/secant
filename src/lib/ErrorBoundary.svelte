<script lang="ts">
  import { Layer } from "m3-svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:boundary>
  {#snippet failed(error, reset)}
    <div class="alert">
      <pre class="blurb">{"Something went wrong" +
          (error instanceof Error ? "\n\nTechnical details:\n" + error.message : "")}</pre>
      {#if !navigator.userAgent.includes("Chrome")}
        <button onclick={() => console.log(error)}>
          <Layer />
          Log
        </button>
      {/if}
      <button onclick={reset}>
        <Layer />
        Reset
      </button>
      <button class="primary" onclick={() => window.location.reload()}>
        <Layer />
        Reload
      </button>
    </div>
  {/snippet}
  {@render children()}
</svelte:boundary>

<style>
  .alert {
    display: flex;
    flex-direction: column;
    margin: auto;
    gap: 0.5rem;
    > * {
      background-color: rgb(var(--m3-scheme-surface-container-highest));
      padding: 1rem;
      border-radius: 0.75rem;
      &:first-child {
        border-start-start-radius: 1.5rem;
        border-start-end-radius: 1.5rem;
      }
      &:last-child {
        border-end-start-radius: 1.5rem;
        border-end-end-radius: 1.5rem;
      }
    }
    > button {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
  }
</style>
