<script lang="ts">
  import { LinearProgress } from "m3-svelte";
  import { onMount } from "svelte";
  import { Spring } from "svelte/motion";
  import { encode, getLogin } from "monoidentity";
  import fullAuto from "./full-auto.remote";

  let percent = new Spring(0, { stiffness: 0.004, damping: 1 });
  const run = async () => {
    const { email, password } = getLogin();
    const r = await fullAuto({ email: encode(email), password: encode(password) });
    const decoder = new TextDecoder();
    let buffer = "";

    const milestones = [
      "browser-starting",
      "page-opening",
      "inputting-email",
      "inputting-password",
      "beginning-navigation",
      "human-verification",
      "beginning-submission",
      "post-submission-1",
      "finalized",
    ];
    const percents = [2, 5, 10, 40, 65, 75, 90, 98, 100];
    percent.set(percents[0]);
    const processMilestone = (milestone: string) => {
      console.log("processing", milestone);

      const index = milestones.indexOf(milestone);
      if (index < 0) return;
      const nextIndex = index + 1;
      if (nextIndex >= percents.length) return;

      console.log("at this point we are", percents[index], "so approach", percents[nextIndex]);
      percent.set(percents[nextIndex]);
    };

    for await (const value of r.body!) {
      buffer += decoder.decode(value);
      const lines = buffer.split("\n");
      buffer = lines.pop()!;
      for (const event of lines.filter(Boolean)) {
        const data = event.replace("data: ", "");
        if (data.startsWith("{")) {
          console.log("todo handle", data);
        } else {
          processMilestone(data);
        }
      }
    }
  };
  onMount(run);
</script>

<div class="container">
  <LinearProgress percent={percent.current} />
  <p>Secant is setting up quick links.</p>
  <p>
    In the process, we'll log in and <strong>you'll get an email about this</strong>, but the
    session will be ephemeral (you can verify this by looking at Secant's source code).
  </p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    max-width: 25rem;
    padding: 1rem;
    gap: 1rem;
    border-radius: 0.125rem 0.125rem var(--m3-util-rounding-medium) var(--m3-util-rounding-medium);
    background-color: rgb(var(--m3-scheme-surface-container-low));
    margin: auto;

    > :global(.m3-container) {
      margin: -1rem -1rem 0 -1rem;
    }
  }
</style>
