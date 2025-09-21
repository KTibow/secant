import { type ElementHandle, launch, Page } from "@astral/astral";
import { fn } from "monoserve";
import { decode } from "monoidentity";
import { object, string } from "valibot";
import { USER, SC_KEY, SC_SECRET } from "$env/static/private";
import Schoology, { type Tokens } from "../../lib/api/schoology";

const client = new Schoology(SC_KEY, SC_SECRET);
// type Action =
//   | { type: "click"; point: [number, number] }
//   | { type: "drag"; from: [number, number]; to: [number, number] };
// const solveCaptcha = async (page: Page) => {
//   const start = Date.now();
//   const getElapsed = () => Math.floor((Date.now() - start) / 1000);
//   const saveSS = async () => {
//     await Deno.writeFile(`captcha-${getElapsed()}.png`, await page.screenshot());
//   };
//   for (let callCount = 0; callCount < 15; callCount++) {
//     await page.waitForNetworkIdle({ idleTime: 2000 });

//     const challenge = await page.evaluate(() => {
//       const el = document.querySelector(`iframe[title*="hCaptcha challenge"]`);
//       if (!el) return null;
//       const rect = el.getBoundingClientRect();
//       return {
//         x: rect.x,
//         y: rect.y,
//         width: rect.width,
//         height: rect.height,
//         debug: {
//           html: el.outerHTML,
//         },
//       };
//     });
//     const challengeCount = await page.evaluate(() => {
//       return [...document.querySelectorAll(`iframe[title*="hCaptcha challenge"]`)].length;
//     });
//     console.log("fyi", challenge, challengeCount);
//     if (!challenge) return;
//     if (challenge.y < 0) return;

//     if (callCount > 0 && callCount % 3 == 0) {
//       // we may be stuck, click at bottom right
//       await page.mouse.click(
//         challenge.x + challenge.width - 10,
//         challenge.y + challenge.height - 10,
//       );
//       continue;
//     }

//     const screenshot = await page.screenshot({
//       clip: {
//         x: challenge.x,
//         y: challenge.y,
//         width: challenge.width,
//         height: challenge.height,
//         scale: 1,
//       },
//     });
//     await saveSS();
//     await Deno.writeFile(`captcha-${getElapsed()}-cropped.png`, screenshot);

//     const r = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           authorization: `Bearer ${GOOGLE_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gemini-2.5-flash",
//           reasoning_effort: "none",
//           messages: [
//             {
//               role: "user",
//               content: [
//                 {
//                   type: "text",
//                   text: `Complete the task shown using the format {"reasoning": "<expanation>", "actions": [<action>, ...]}. Each action can be:
// - {"type": "click", "point": [y, x]} to click a point on the image, where y and x are between 0 and 1000
// - {"type": "drag", "from": [y1, x1], "to": [y2, x2]} to drag from one point to another, where y1, x1, y2, and x2 are between 0 and 1000

// Most of the time, your actions will just be clicking one or two images then clicking the verify button (the skip button turns into a verify button after you complete the task).`,
//                 },
//                 {
//                   type: "image_url",
//                   image_url: {
//                     url:
//                       "data:image/png;base64," +
//                       btoa(screenshot.reduce((data, byte) => data + String.fromCharCode(byte), "")),
//                   },
//                 },
//               ],
//             },
//           ],
//           temperature: 0,
//         }),
//       },
//     );
//     if (!r.ok) {
//       console.error(await r.text());
//       throw new Error(`Google is ${r.status}ing`);
//     }
//     const { choices } = (await r.json()) as any;
//     const message = choices[0].message.content as string;
//     const json = message.substring(message.indexOf("{"), message.lastIndexOf("}") + 1);
//     const { reasoning, actions } = JSON.parse(json) as { reasoning: string; actions: Action[] };
//     console.log("Reasoning:", reasoning);
//     if (!actions.length) {
//       console.log("No actions provided, weird");
//       return;
//     }
//     for (let i = 0; i < actions.length; i++) {
//       const action = actions[i];
//       console.log(action);
//       if (action.type == "click") {
//         console.log("Clicking", action.point);
//         const x = challenge.x + (action.point[1] / 1000) * challenge.width;
//         const y = challenge.y + (action.point[0] / 1000) * challenge.height;
//         await page.mouse.click(x, y);
//       } else if (action.type == "drag") {
//         console.log("Dragging from", action.from, "to", action.to);
//         const x1 = challenge.x + (action.from[1] / 1000) * challenge.width;
//         const y1 = challenge.y + (action.from[0] / 1000) * challenge.height;
//         const x2 = challenge.x + (action.to[1] / 1000) * challenge.width;
//         const y2 = challenge.y + (action.to[0] / 1000) * challenge.height;
//         await page.mouse.move(x1, y1);
//         await page.mouse.down();
//         await page.mouse.move(x2, y2, { steps: 33 });
//         await page.mouse.up();
//       }
//       await page.waitForTimeout(1000);
//       await saveSS();
//     }
//   }
// };
export default fn(object({ email: string(), password: string() }), async ({ email, password }) => {
  email = decode(email);
  password = decode(password);

  const stream = new TransformStream();
  const streamResponse = new Response(stream.readable, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive",
    },
  });
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const send = (text: string) => writer.write(encoder.encode(`data: ${text}\n\n`));

  (async () => {
    await send("browser-starting");
    let path = undefined;
    if (USER == "kendell") {
      path = await Deno.makeTempFile();
      await Deno.writeTextFile(
        path,
        `#!/bin/bash
exec flatpak run org.chromium.Chromium "$@"
`,
      );
      await Deno.chmod(path, 0o755);
    }

    await using browser = await launch({
      path,
      args: ["--no-sandbox"],
      headless: false,
    });

    await send("page-opening");
    await using page = await browser.newPage("https://nsd.schoology.com");

    await send("inputting-email");
    const emailInput = (await page.$('input[type="email"]')) as ElementHandle;
    await emailInput.type(email, { delay: 100 });
    await emailInput.type("\n");
    await page.waitForNetworkIdle({ idleTime: 1500 });

    await send("inputting-password");
    const passwordInput = (await page.$('input[type="password"]')) as ElementHandle;
    await passwordInput.type(password, { delay: 100 });
    await passwordInput.type("\n");
    await page.waitForNavigation({ waitUntil: "load" });

    await send("beginning-navigation");
    const rqTokenParams = new URLSearchParams(
      await client.makeRequest(new Request("https://api.schoology.com/v1/oauth/request_token")),
    );
    const rqToken: Tokens = {
      key: rqTokenParams.get("oauth_token")!,
      secret: rqTokenParams.get("oauth_token_secret")!,
    };
    const authUrl = `https://nsd.schoology.com/oauth/authorize?oauth_token=${rqToken.key}&oauth_callback=https://www.powerschool.com/wp-content/uploads/2025/03/solution-ed-item-talent-1487850.png`;

    await send("completing-navigation");
    await page.goto(authUrl);

    await send("human-verification");
    const checkboxLocation = (await page.evaluate(() => {
      const iframe = document.querySelector("iframe");
      if (!iframe) return null;

      const rect = iframe.getBoundingClientRect();
      return {
        x: rect.x + 10,
        y: rect.y + rect.height / 2,
      };
    })) as { x: number; y: number };
    await page.mouse.click(checkboxLocation.x, checkboxLocation.y);
    await page.waitForNetworkIdle({ idleTime: 2000 });
    // await solveCaptcha(page);

    // while (true) {
    //   const code = prompt("> ");
    //   if (!code) break;
    //   const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as any;
    //   const asyncFn = new AsyncFunction("page", code);
    //   const result = await asyncFn(page);

    //   console.log(result);
    // }

    await send("beginning-submission");
    const submit = (await page.$("#edit-approve")) as ElementHandle;
    await submit.click();
    // await Deno.writeFile("submitting.png", await page.screenshot());
    await send("completing-submission");
    try {
      await page.waitForFunction(() => location.hostname == "www.powerschool.com");
    } catch {
      // await Deno.writeFile("submitting-fail.png", await page.screenshot());
      throw new Error("Failed to submit OAuth form");
    }

    await send("post-submission-1");
    const acTokenParams = new URLSearchParams(
      await client.makeRequest(
        new Request("https://api.schoology.com/v1/oauth/access_token"),
        rqToken,
      ),
    );
    const acToken: Tokens = {
      key: acTokenParams.get("oauth_token")!,
      secret: acTokenParams.get("oauth_token_secret")!,
    };

    await send("post-submission-2");
    const userData = await client.makeRequest(
      new Request("https://api.schoology.com/v1/users/me"),
      acToken,
    );

    await send("finalized");
    await send(
      JSON.stringify({
        user_id: userData.id,
        token: acToken,
      }),
    );

    await writer.close();
  })();
  return streamResponse;
});
