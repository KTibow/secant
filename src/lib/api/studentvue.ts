import { getLoginRecognized, relog } from "monoidentity";
import fastStudentvue from "fast-studentvue";

export const studentvue = (methodName: string, params?: Record<string, string>) => {
  let login: { email: string; password: string };
  try {
    login = getLoginRecognized();
  } catch {
    relog();
  }
  return fastStudentvue(login, relog, methodName, params);
};
