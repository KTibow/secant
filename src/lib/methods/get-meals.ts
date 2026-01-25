import { districtApps, schoolApps } from "school-districts";
import { cacheMonthly } from "../utils-cache";
import { getLoginRecognized } from "monoidentity";
import getSchoolName from "./get-school-name";
import getMenusRemote from "./get-meal-menus.remote";
import readMenusRemote from "./get-meal-read-menus.remote";

export type Listing = Record<string, string[]>;

const getDistrictBase = () => {
  const { email } = getLoginRecognized();
  const domain = email.split("@")[1];

  const apps = districtApps[domain];
  if (!apps) {
    throw new Error("Unknown district");
  }

  const msm = apps.find((app) => app.app == "My School Menus");
  if (!msm) {
    throw new Error("Unsupported district");
  }

  return msm.base;
};
const getSchoolBase = async () => {
  const { email } = getLoginRecognized();
  const domain = email.split("@")[1];

  const appsGroup = schoolApps[domain];
  if (!appsGroup) {
    throw new Error("Unknown district");
  }

  const apps = appsGroup[await getSchoolName()];
  if (!apps) {
    throw new Error("Unknown school");
  }

  const msm = apps.find((app) => app.app == "My School Menus");
  if (!msm) {
    throw new Error("Unsupported school");
  }

  return msm.base;
};

const getMenus = cacheMonthly("all-menus", async () => {
  const base = await getSchoolBase();

  const menus = await getMenusRemote(base);

  return menus;
});

export default async () => {
  const menus = await getMenus();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return await readMenusRemote({ base: getDistrictBase(), menus, year, month });
};
