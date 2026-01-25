import { fn } from "monoserve";
import { pipe, string, regex } from "valibot";

export default fn(
  pipe(string(), regex(/^https:\/\/menus\.healthepro\.com\/api\/organizations\/\d+\/sites\/\d+$/)),
  async (base) => {
    const r = await fetch(`${base}/menus`);
    if (!r.ok) {
      throw new Response(`MSM is ${r.status}ing`, { status: 500 });
    }
    const { data }: { data: { id: number; name: string }[] } = await r.json();
    return data.map(({ id, name }) => ({
      name: name.replace(/^\d+-\d+ /, "").replace(/^(?:Elementary|Middle|High) School /, ""),
      id,
    }));
  },
);
