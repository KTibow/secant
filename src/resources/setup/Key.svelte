<script lang="ts">
  import iconExternal from "@ktibow/iconset-material-symbols/arrow-outward-rounded";
  import { Icon } from "m3-svelte";
  import { save } from "./save";
  import getId from "./get-id.remote";
  import type { AuthBase } from "../../lib/api/schoology";
  import { encode } from "monoidentity";

  let key = $state("");
  let secret = $state("");
  let secretEl: HTMLInputElement | undefined = $state();

  const submit = async () => {
    // Encode
    const keyEncoded = encode(key);
    const secretEncoded = encode(secret);
    const authBase: AuthBase = {
      token: { key: keyEncoded, secret: secretEncoded },
      appToken: "token",
    };
    // Enrich
    const { id } = await getId(authBase);
    save({ ...authBase, userId: id });
  };
</script>

<div class="group">
  <a href="https://nsd.schoology.com/api" target="_blank">
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
  .group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  a {
    @apply --m3-body-medium;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    color: var(--m3c-primary);
  }
  input {
    height: 3rem;
    padding-inline: 0.75rem;
    background: var(--m3c-surface-container-low);
    border-radius: var(--m3-shape-medium);
  }
</style>
