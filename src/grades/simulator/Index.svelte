<script lang="ts">
  import Simulator from "./Simulator.svelte";
  import type { ClassGrade } from "../lib/types";

  let clazz: ClassGrade & { grade: number } = $props();

  let dialogRef: HTMLDialogElement | null = null;

  export function open() {
    dialogRef?.showModal();
  }

  function close() {
    dialogRef?.close();
  }
</script>

<dialog closedby="any" bind:this={dialogRef}>
  <Simulator {...clazz} {close} />
</dialog>

<style>
  dialog {
    flex-direction: column;
    background-color: rgb(var(--m3-scheme-surface-container));
    border-radius: 1.75rem;
    @media (width >= 40rem) {
      width: 40rem;
    }
    max-width: 40rem;
    max-height: 90%;
    overflow: hidden;

    padding: 1.5rem;
    opacity: 1;
    clip-path: inset(0 0 0 0 round 1.75rem);
    @starting-style {
      clip-path: inset(0 0 100% 0 round 1.75rem);
      opacity: 0;
    }
    transition: 0.5s cubic-bezier(0.05, 0.7, 0.1, 1);

    &:open {
      display: flex;
    }
  }
</style>
