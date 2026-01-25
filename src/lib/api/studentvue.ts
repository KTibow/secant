import { getLoginRecognized, relog } from "monoidentity";
import fastStudentvue, { getStudentVueBase } from "fast-studentvue";

export const svAvailable = () => {
  try {
    const { email } = getLoginRecognized();
    getStudentVueBase(email);
    return true;
  } catch {
    return false;
  }
};

let authFails = 0;
export const studentvue = (methodName: string, params?: Record<string, string>) => {
  let login: { email: string; password: string };
  try {
    login = getLoginRecognized();
  } catch {
    relog();
    throw new Error("Redirecting to login...");
  }
  return fastStudentvue(
    login,
    () => {
      authFails++;
      if (authFails < 3) {
        throw new Error("Invalid auth, will relog soon");
      }
      console.trace("Relogging");
      relog();
    },
    methodName,
    params,
  );
};
