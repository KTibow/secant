<script lang="ts">
  import { trackCachedAuto } from "../lib/data-tracking";
  import teacherInfoRemote from "./teacher-info.remote";
  import { getSubs } from "./subs";
  import { onDestroy } from "svelte";
  import TeacherInfo from "./TeacherInfo.svelte";

  let { teachers, teacher }: { teachers: string[]; teacher?: string } = $props();

  const aborter = new AbortController();
  onDestroy(() => {
    aborter.abort();
  });

  let birthdays = trackCachedAuto({
    id: "teacher-birthdays",
    loader: async () => {
      return await teacherInfoRemote(teachers, { signal: aborter.signal });
    },
  });

  let subs = trackCachedAuto({
    id: "teacher-subs",
    loader: getSubs,
  });

  let isBirthday = $derived(Boolean(teacher && $birthdays.data?.includes(teacher)));
  let isSubbed = $derived(Boolean(teacher && $subs.data?.includes(teacher)));
</script>

{#if teacher && (isBirthday || isSubbed)}
  <TeacherInfo {teacher} {isBirthday} {isSubbed} />
{/if}
