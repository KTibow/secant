<script lang="ts">
  import { Switch } from "m3-svelte";
  import Managed from "./managed/Managed.svelte";
  import Key from "./Key.svelte";

  let { finish }: { finish: () => void } = $props();
  let page = $state("home");
</script>

{#if page == "home"}
  <label class="center m3-font-title-large">
    Quick links
    <Switch bind:checked={() => false, () => (page = "managed")} />
  </label>
  <p class="disclosure">
    Toggling that switch lets Secant manage setup. You may like to
    <button class="link" onclick={() => (page = "key")}>provide API keys instead</button>.
  </p>
{:else if page == "managed"}
  <Managed {finish} />
{:else if page == "key"}
  <Key {finish} />
{/if}

<style>
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin: auto;
  }
  .disclosure {
    text-align: center;
    opacity: 0.6;
    margin-bottom: 1.5rem;
  }
  .link {
    color: rgb(var(--m3-scheme-primary));
  }
</style>
