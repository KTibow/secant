<script lang="ts">
  import iconExternal from "@ktibow/iconset-material-symbols/arrow-outward-rounded";
  import { Icon } from "m3-svelte";
  import { save } from "./save";

  let { finish }: { finish: () => void } = $props();

  let key = $state("");
  let secret = $state("");
  let secretEl: HTMLInputElement | undefined = $state();

  const focus = (node: HTMLInputElement) => {
    node.focus();
  };
  const submit = async () => {
    await save({ token: { key, secret }, appToken: "token" }, true);
    finish();
  };
</script>

<div class="center">
  <a class="m3-font-body-medium" href="https://nsd.schoology.com/api" target="_blank">
    <Icon icon={iconExternal} size={20} />
    Get key
  </a>
  <!-- svelte-ignore a11y_autofocus -->
  <input
    class="focus-inset"
    placeholder="Key"
    bind:value={key}
    autofocus
    onpaste={() => setTimeout(() => secretEl?.focus())}
  />
  <input
    class="focus-inset"
    placeholder="Secret"
    bind:value={secret}
    bind:this={secretEl}
    onpaste={() => setTimeout(submit)}
  />
</div>

<style>
  .center {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: auto;
  }
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    color: rgb(var(--m3-scheme-primary));
  }
  input {
    height: 3rem;
    padding-inline: 0.75rem;
    background: rgb(var(--m3-scheme-surface-container-low));
    border-radius: var(--m3-util-rounding-medium);
  }
</style>
