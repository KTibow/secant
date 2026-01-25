<script lang="ts">
  import Pane from "../lib/Pane.svelte";
  import Viz from "../lib/Viz.svelte";
  import { trackCachedAuto } from "../lib/data-tracking";
  import getMeals from "../lib/methods/get-meals";
  import { now } from "../lib/utils-now.svelte";

  const meals = trackCachedAuto({
    id: "meals",
    loader: getMeals,
  });

  // let today = $derived(now.toISOString().slice(0, 10));
  let today = "2025-11-10";
  let todayMeals = $derived($meals.data && $meals.data[today]);
</script>

<Viz loading={$meals.loading} errored={$meals.errors.length > 0} />
{#each todayMeals as { menu, listing }, i}
  <Pane order={menu == "Lunch" ? 150 + i : i}>
    <div class="listing">
      {#each Object.entries(listing) as [category, items]}
        <article>
          <h2 class="m3-font-title-medium">{category}</h2>
          <ul>
            {#each items as item}
              <li>{item}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
    {#snippet status()}
      {menu}
    {/snippet}
  </Pane>
{/each}

<style>
  .listing {
    margin-block: auto;
    @media (width >= 37.5rem) {
      column-count: 2;
    }
  }
  article {
    display: flex;
    flex-direction: column;
    break-inside: avoid;
  }
  h2 {
    display: flex;
    align-items: center;
    height: 2rem;
    padding-inline: 0.5rem;
    border-radius: var(--m3-util-rounding-large);
    align-self: start;
    background-color: rgb(var(--m3-scheme-primary-container-subtle));
    color: rgb(var(--m3-scheme-on-primary-container-subtle));
  }
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    display: flex;
    padding: 0.5rem;
    border-radius: var(--m3-util-rounding-large);
    background-color: rgb(var(--m3-scheme-background));
  }
</style>
