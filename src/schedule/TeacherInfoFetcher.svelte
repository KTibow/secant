<script lang="ts">
  import { trackCachedAuto } from "../lib/data-tracking";
  import teacherInfoRemote from "./teacher-info.remote";
  import { onDestroy } from "svelte";
  import TeacherInfo from "./TeacherInfo.svelte";

  let { teachers, teacher }: { teachers: string[]; teacher?: string } = $props();

  const aborter = new AbortController();
  onDestroy(() => {
    aborter.abort();
  });

  let teacherInfo = trackCachedAuto({
    id: "teacher-info",
    loader: async () => {
      return await teacherInfoRemote(teachers, { signal: aborter.signal });
    },
  });

  let currentTeacherInfo = $derived($teacherInfo.data?.find((info) => info.teacher == teacher));
</script>

{#if currentTeacherInfo && (currentTeacherInfo.isBirthday || currentTeacherInfo.isSubbed)}
  <TeacherInfo {...currentTeacherInfo} />
{/if}
