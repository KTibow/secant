import { districtSemesters } from "school-districts";
import { getLoginRecognized } from "monoidentity";

export const getSemester = () => {
  const { email } = getLoginRecognized();
  const domain = email.split("@")[1];
  const semester = districtSemesters[domain];
  if (!semester) {
    throw new Error("No semester information found");
  }
  return semester;
};
