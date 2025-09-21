import { launch } from "@astral/astral";
import { fn } from "monoserve";

export default fn(async () => {
  // Launch the browser
  await using browser = await launch();

  // Open a new page
  await using page = await browser.newPage("https://deno.land");

  const screenshot = await page.screenshot();

  return new Response(screenshot, { headers: { "Content-Type": "image/png" } });
});
