<script lang="ts">
  import Simulator from "./Simulator.svelte";
  import type { Assignment } from "./lib";

  let {
    categories,
    assignments,
    futureAssignments,
    grade,
  }: {
    categories: Record<string, { earned: number; possible: number; weight: number }> | undefined;
    assignments: Assignment[];
    futureAssignments: { points: number; category: string }[];
    grade: number;
  } = $props();

  let dialogRef: HTMLDialogElement | null = null;

  export function open() {
    dialogRef?.showModal();
  }

  function close() {
    dialogRef?.close();
  }
</script>

<dialog closedby="any" bind:this={dialogRef}>
  <Simulator {categories} {assignments} {futureAssignments} {grade} {close} />
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
