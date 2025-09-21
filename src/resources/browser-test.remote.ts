import { type ElementHandle, launch } from "@astral/astral";
import { fn } from "monoserve";

export default fn(async () => {
  // Launch the browser
  await using browser = await launch({
    args: ["--no-sandbox"],
    launchPresets: { windowSize: { width: 1280, height: 720 } },
  });

  // Open a new page
  await using page = await browser.newPage("https://nsd.schoology.com");

  const emailInput = (await page.$('input[type="email"]')) as ElementHandle;
  await emailInput.type("1000000@apps.nsd.org", { delay: 100 });
  await emailInput.type("\n");

  const screenshot = await page.screenshot();

  return new Response(screenshot, { headers: { "Content-Type": "image/png" } });
});
