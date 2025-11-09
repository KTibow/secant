import { districtApps } from "school-districts";
import { getLoginRecognized } from "monoidentity";

export const getSubs = async () => {
  const { email } = getLoginRecognized();
  const domain = email.split("@")[1];
  const apps = districtApps[domain];
  if (!apps) {
    throw new Error("Unknown domain");
  }

  const base = apps.find((a) => a.app == "StudentVue")?.base;
  if (!base) {
    throw new Error("District does not use StudentVue");
  }

  const r = await fetch(`${base.replace("-psv", "")}/Service/SubLogin.asmx/LoadSubs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      curSchoolOrgYearGU: import.meta.env.VITE_PUBLIC_TEACHER_INFO_SCHOOL,
      dn: "",
    }),
  });

  if (!r.ok) throw new Error(`StudentVue is ${r.status}ing: ${await r.text()}`);

  const { d }: { d: { Name: string }[] } = await r.json();
  return d
    .map((x) => x.Name)
    .filter((n) => n != "Select a substitute...")
    .map((x) => x.split(", ").reverse().join(" "));
};
