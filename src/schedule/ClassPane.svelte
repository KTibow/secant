<script lang="ts">
  import Pane from "../lib/Pane.svelte";
  import { ordinal } from "../lib/ordinal";
  import { Icon } from "m3-svelte";
  import iconExternal from "@ktibow/iconset-material-symbols/arrow-outward-rounded";
  import iconTest from "@ktibow/iconset-material-symbols/task-alt-rounded";
  import iconExpand from "@ktibow/iconset-material-symbols/expand-more-rounded";
  import iconCollapse from "@ktibow/iconset-material-symbols/expand-less-rounded";

  import type { Class } from "../lib/combine";

  let {
    clazz,
    order,
    ...rest
  }: {
    clazz: Class;
    order: number;
    [key: string]: any;
  } = $props();

  let gradeOpen = $state(false);
</script>

<Pane {order} {...rest}>
  {#snippet status()}
    {clazz.name} • {ordinal(clazz.period)}
  {/snippet}
  <div class="content-wrapper">
    <div class="header">
      <h2>{clazz.name}</h2>
      {#if clazz.grade?.reportedGrade !== undefined}
        <button class="grade-button" onclick={() => (gradeOpen = !gradeOpen)}>
          <span class="score">{clazz.grade.reportedGrade}%</span>
          <Icon icon={gradeOpen ? iconCollapse : iconExpand} />
        </button>
        {#if gradeOpen}
          <div class="assignments-list">
            {#each clazz.grade.assignments || [] as assignment}
              <div class="assignment" class:missing={assignment.missing}>
                <span class="name">{assignment.name}</span>
                <span class="points">{assignment.earned}/{assignment.possible}</span>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>

    {#if clazz.resources}
      <div class="resources-grid">
        {#each clazz.resources.links as link}
          <a href={link.url} target="_blank" class="resource-card link">
            <span class="title">{link.title}</span>
            <div class="icon-wrapper">
              <Icon icon={iconExternal} />
            </div>
          </a>
        {/each}
        {#each clazz.resources.resources as resource}
          <a
            href={resource.url}
            target="_blank"
            class="resource-card"
            class:submitted={resource.submitted}
          >
            {#if resource.icon === "test"}
              <div class="icon-area">
                <Icon icon={iconTest} />
              </div>
            {/if}
            <span class="title">{resource.title}</span>
            {#if resource.text}
              <span class="description">{resource.text}</span>
            {/if}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</Pane>

<style>
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
    padding: 2rem 0;
    gap: 3rem;
  }
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
  }
  .grade-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--m3c-primary);
    padding: 0.5rem 1rem;
    border-radius: 999px;
    transition: background-color 0.2s;
  }
  .grade-button:hover {
    background-color: var(--m3c-primary-container);
    color: var(--m3c-on-primary-container);
  }
  .score {
    font-size: 3rem;
    font-weight: 300;
  }
  .assignments-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 30rem;
    gap: 0.5rem;
    background: var(--m3c-surface-container);
    padding: 1rem;
    border-radius: 1rem;
    max-height: 20rem;
    overflow-y: auto;
  }
  .assignment {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    padding: 0.25rem 0;
  }
  .assignment.missing {
    color: var(--m3c-error);
  }
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 1rem;
  }
  .points {
    font-variant-numeric: tabular-nums;
    font-weight: bold;
    white-space: nowrap;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }
  .resource-card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: var(--m3c-surface-container-high);
    border-radius: 2rem;
    color: var(--m3c-on-surface);
    text-decoration: none;
    gap: 0.5rem;
    transition:
      filter 0.2s,
      transform 0.2s;
    min-height: 10rem;
    position: relative;
  }
  .resource-card:active {
    filter: brightness(0.9);
    transform: scale(0.98);
  }
  .resource-card.link {
    background: var(--m3c-secondary-container);
    color: var(--m3c-on-secondary-container);
    justify-content: space-between;
  }
  .resource-card.submitted {
    opacity: 0.6;
    background: var(--m3c-surface-container);
  }
  .title {
    font-weight: bold;
    font-size: 1.1rem;
    line-height: 1.3;
  }
  .description {
    font-size: 0.9rem;
    opacity: 0.8;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  .icon-wrapper {
    align-self: flex-end;
  }
  .icon-area {
    margin-bottom: 0.5rem;
    color: var(--m3c-primary);
  }
</style>
