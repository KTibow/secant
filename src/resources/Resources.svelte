<script lang="ts">
  import iconDone from "@ktibow/iconset-material-symbols/done-all-rounded";
  import iconExternal from "@ktibow/iconset-material-symbols/arrow-outward-rounded";
  import iconTest from "@ktibow/iconset-material-symbols/task-alt-rounded";
  import { Button, Icon } from "m3-svelte";
  import type { ResourceData } from "./loader.remote";
  let {
    resources,
    links,
    completedAssignments,
  }: ResourceData & {
    completedAssignments: string[];
  } = $props();
</script>

{#if resources.every((r) => completedAssignments.includes(r.title) || r.submitted)}
  <div class="zen m3-font-headline-large">
    {#if resources.length}
      <Icon icon={iconDone} size={40} />
      In zen
    {:else}
      In emptiness
    {/if}
  </div>
  <div class="zen-links">
    {#each links as { title, url }}
      <Button variant="tonal" iconType="left" square href={url} target="_blank">
        <Icon icon={iconExternal} />
        {title}
      </Button>
    {/each}
  </div>
{:else}
  <div class="resources">
    {#each links as { title, url }}
      <a href={url} target="_blank" class="resource link m3-font-headline-large">
        <Icon icon={iconExternal} />
        <div class="content-b">
          {title}
        </div>
      </a>
    {/each}
    {#each resources.slice(0, 8) as { icon, title, url, text, submitted }}
      <a
        href={url}
        target="_blank"
        class="resource m3-font-headline-large"
        class:graded={completedAssignments.includes(title)}
        class:submitted={!completedAssignments.includes(title) && submitted}
      >
        {#if icon == "test"}
          <Icon icon={iconTest} />
        {:else if text}
          <div class="content-a">
            {text}
          </div>
        {/if}
        <div class="content-b" style:margin-top="auto">
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
    margin-block: auto;
    > :global(svg) {
      color: rgb(var(--m3-scheme-secondary));
    }
  }
  .zen-links {
    display: flex;
    gap: 1rem;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    pointer-events: none;
    > :global(*) {
      pointer-events: auto;
    }
  }

  .resources {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    gap: 0.5rem;
    padding: 0.5rem;
    align-self: stretch;
    flex: 1 1 0;
  }
  .resource {
    display: flex;
    flex-direction: column;
    min-width: 20dvw;
    min-height: 10rem;
    flex-grow: 1000;
    padding: 1rem;
    border-radius: var(--m3-util-rounding-medium);
    &:active {
      border-radius: var(--m3-util-rounding-small);
    }
    transition: border-radius var(--m3-util-easing-fast-spatial);
    background-color: rgb(var(--m3-scheme-surface-container-low));
    &.link {
      background-color: rgb(var(--m3-scheme-secondary-container-subtle));
      color: rgb(var(--m3-scheme-on-secondary-container-subtle));
    }
    &.graded {
      background-color: transparent;
      color: rgb(var(--m3-scheme-on-surface) / 0.38);
      outline: solid 2px rgb(var(--m3-scheme-outline-variant));
      outline-offset: -2px;
    }
    &.submitted {
      background-color: rgb(var(--m3-scheme-on-surface) / 0.08);
      color: rgb(var(--m3-scheme-on-surface) / 0.38);
    }
  }
  .content-a,
  .content-b {
    max-height: 3.75em;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .content-a {
    contain: inline-size;
  }
  .content-b {
    max-width: clamp(10rem, 40dvw, 25rem);
    margin-top: auto;
  }
</style>
