import { fn } from "monoserve";
import { array, number, object, pipe, regex, string } from "valibot";
import type { Listing } from "./get-meals";

const input = object({
  base: pipe(string(), regex(/^https:\/\/menus\.healthepro\.com\/api\/organizations\/\d+$/)),
  menus: array(object({ name: string(), id: number() })),
  year: number(),
  month: number(),
});
export default fn(input, async ({ base, menus, year, month }) => {
  const nowFragment = `year/${year}/month/${month}`;
  const output: Record<string, { menu: string; listing: Listing }[]> = {};
  for await (const [name, data] of menus.map(async ({ name, id }) => {
    const r = await fetch(`${base}/menus/${id}/${nowFragment}/date_overwrites`);
    if (!r.ok) {
      throw new Error(`MSM is ${r.status}ing`);
    }
    const { data }: { data: { day: string; setting: string }[] } = await r.json();
    return [name, data] as const;
  })) {
    for (const { day, setting } of data) {
      const {
        current_display,
      }: { current_display: { type: "category" | "recipe"; name: string }[] } = JSON.parse(setting);
      if (current_display.length == 0) {
        continue;
      }

      const listing: Listing = {};
      let category = "";
      for (const item of current_display) {
        if (item.type == "category") {
          category = item.name;
        } else if (item.type == "recipe") {
          (listing[category] ||= []).push(item.name);
        }
      }
      (output[day] ||= []).push({ menu: name, listing });
    }
  }
  return output;
});
