import { getStorage } from "monoidentity";
import type { FullAuth } from "../lib/api/schoology";
import remote from "./loader.remote";

export default async (auth: FullAuth, skipSubmittedCheck: Record<string, string[]>) => {
  const pacificDate = new Date().toLocaleDateString(undefined, {
    timeZone: "America/Los_Angeles",
    month: "numeric",
    day: "numeric",
  });

  let [pacificMonth, pacificDay] = pacificDate.split("/");
  const fullMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][parseInt(pacificMonth) - 1];

  if (pacificMonth.length == 1) pacificMonth = `0?${pacificMonth}`;
  if (pacificDay.length == 1) pacificDay = `0?${pacificDay}`;

  const todayRegex = new RegExp(
    String.raw`\b${pacificMonth}/${pacificDay}\b|\b${fullMonth} ${pacificDay}(?![0-9])`,
  );

  const cache = getStorage("cache");

  const predSections = cache["schoology-sections"] || [];
  const predSubmitted = cache["schoology-submitted"] || [];

  const { resources, sections } = await remote({
    auth,
    predSections,
    predSubmitted,
    skipSubmittedCheck,
    todayRegex,
  });

  cache["schoology-sections"] = sections;
  const submittedCache: Record<string, string[]> = {};
  for (const id in resources) {
    submittedCache[id] = resources[id].resources.filter((r) => r.submitted).map((r) => r.title);
  }
  cache["schoology-submitted"] = submittedCache;

  return resources;
};
