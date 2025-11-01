<script lang="ts">
  import type { TeacherInfo } from "./teacher-info.remote";

  let { teacher, isBirthday, isSubbed }: TeacherInfo = $props();
</script>

<div class="teacher-info">
  {#if isBirthday}
    <span class="birthday">🎂 Happy birthday {teacher}</span>
  {/if}
  {#if isSubbed}
    <span class="subbed">👤 Sub today</span>
  {/if}
</div>

<style>
  .teacher-info {
    display: flex;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    gap: 1rem;

    border-radius: var(--m3-util-rounding-extra-small);
    align-items: center;
    padding: 0.5rem;
    background-color: rgb(var(--m3-scheme-inverse-surface));
    color: rgb(var(--m3-scheme-inverse-on-surface));
  }
</style>
