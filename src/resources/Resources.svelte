<script lang="ts">
  import iconDone from "@ktibow/iconset-material-symbols/done-all-rounded";
  import iconExternal from "@ktibow/iconset-material-symbols/arrow-outward-rounded";
  import iconTest from "@ktibow/iconset-material-symbols/task-alt-rounded";
  import { Button, Icon, Layer } from "m3-svelte";
  import type { ResourceData } from "./loader.remote";
  let {
    resources,
    links,
    completedAssignments,
  }: ResourceData & {
    completedAssignments: string[];
  } = $props();
</script>

{#if resources.every((r) => completedAssignments.includes(r.title))}
  <div class="zen m3-font-headline-large">
    {#if resources.length}
      <Icon icon={iconDone} width="2.5rem" height="2.5rem" />
      In zen
    {:else}
      In emptiness
    {/if}
  </div>
  <div class="zen-links-anchor">
    <div class="zen-links m3-font-body-medium">
      {#each links as { title, url }}
        <Button variant="text" href={url} target="_blank">
          {title}
        </Button>
      {/each}
    </div>
  </div>
{:else}
  <div class="resources">
    {#each links as { title, url }}
      <a href={url} target="_blank" class="resource link m3-font-headline-large">
        <Icon icon={iconExternal} />
        <div class="content">
          {title}
        </div>
      </a>
    {/each}
    {#each resources.slice(0, 8) as { icon, title, url }}
      <a
        href={url}
        target="_blank"
        class="resource m3-font-headline-large"
        class:gray={completedAssignments.includes(title)}
      >
        {#if icon == "test"}
          <Icon icon={iconTest} />
        {:else if icon == "worksheet"}
          ?
        {/if}
        <div class="content">
          {title}
        </div>
      </a>
    {/each}
  </div>
{/if}

<style>
  .zen {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin: auto;
    > :global(svg) {
      color: rgb(var(--m3-scheme-secondary));
    }
  }
  .zen-links-anchor {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .zen-links {
    display: flex;
    gap: 1rem;
    align-self: center;
    position: absolute;
    bottom: 0.5rem;
  }

  .resources {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .resource {
    display: flex;
    flex-direction: column;
    min-width: 20dvw;
    min-height: 10rem;
    flex-grow: 1000;
    padding: 1rem;
    border-radius: var(--m3-util-rounding-large);
    background-color: rgb(var(--m3-scheme-surface-container-low));
    &.link {
      background-color: rgb(var(--m3-scheme-secondary-container-subtle));
      color: rgb(var(--m3-scheme-on-secondary-container-subtle));
    }
    &.gray {
      flex-grow: 1;
      background-color: transparent;
      color: rgb(var(--m3-scheme-on-surface) / 0.38);
      outline: solid 2px rgb(var(--m3-scheme-outline-variant));
      outline-offset: -2px;
    }
  }
  .content {
    max-width: 30rem;
    max-height: 3.75em;
    margin-top: auto;
  }
</style>
