import { studentvue, svAvailable } from "../api/studentvue";
import { first } from "../utils-xml";
import { cacheMonthly } from "../utils-cache";

export default cacheMonthly("school", async () => {
  if (svAvailable()) {
    const data = await studentvue("StudentSchoolInfo");
    return first(data.StudentSchoolInfoListing)["@_School"];
  } else {
    throw new Error("Unknown district");
  }
});
