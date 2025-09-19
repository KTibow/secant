import districts from "school-districts";
import { getLogin } from "monoidentity";

export const getSemester = () => {
  const { email } = getLogin();
  const domain = email.split("@")[1];
  const district = districts[domain];
  if (!district) {
    throw new Error("Unknown district");
  }
  const semester = district.semester;
  if (!semester) {
    throw new Error("District does not have semester information");
  }
  return semester;
};
