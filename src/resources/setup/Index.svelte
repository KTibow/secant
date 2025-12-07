<script lang="ts">
  import { Switch } from "m3-svelte";
  import Managed from "./managed/Managed.svelte";
  import Key from "./Key.svelte";

  let page = $state("home");
</script>

{#if page == "home"}
  <label>
    Quick links
    <Switch bind:checked={() => false, () => (page = "managed")} />
  </label>
  <p class="disclosure">
    Toggling that switch lets Secant manage setup. You may like to
    <button class="link" onclick={() => (page = "key")}>provide API keys instead</button>.
  </p>
{:else if page == "managed"}
  <Managed />
{:else if page == "key"}
  <Key />
{/if}

<style>
  label {
    @apply --m3-title-large;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-block: auto;
  }
  .disclosure {
    text-align: center;
    opacity: 0.6;
    margin-bottom: 1.5rem;
  }
  .link {
    color: var(--m3c-primary);
  }
</style>
