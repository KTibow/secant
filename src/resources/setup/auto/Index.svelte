<script lang="ts">
  import { Spring } from 'svelte/motion';
  import { getLoginRecognized } from 'monoidentity';
  import { produceStudentVue, consumeStudentVue } from 'monoidentity-verification';
  import retrieve from './retrieve.remote';
  import { onMount } from 'svelte';
  import { save } from '../save';

  let { fail }: { fail: () => void } = $props();

  let loading = $state('Taking a good hard look at you');
  let progress = new Spring(0, { stiffness: 0.05, damping: 1 });
  const init = async () => {
    const login = getLoginRecognized();
    progress.target = 0.2;
    const token = await produceStudentVue(login.email, login.password);

    progress.target = 0.6;
    const jwt = await consumeStudentVue({ token, email: login.email }, undefined);

    loading = 'Finding saved authentication';
    progress.target = 0.8;
    const authSaved = await retrieve(jwt);
    if (authSaved) {
      save(authSaved);
      return;
    }

    fail();
  };
  onMount(init);
</script>

<h2 style:--progress="{progress.current * 100}%">{loading}</h2>

<style>
  h2 {
    @apply --m3-headline-large;
    margin: auto;

    background-clip: text;
    background-image: linear-gradient(
      to right,
      var(--m3c-on-surface) var(--progress),
      --translucent(var(--m3c-on-surface-variant), 0.5) var(--progress)
    );
    color: transparent;
  }
</style>
