import { getLoginRecognized, relog } from "monoidentity";
import fastStudentvue from "fast-studentvue";

export const studentvue = (methodName: string, params?: Record<string, string>) =>
  fastStudentvue(getLoginRecognized(), relog, methodName, params);
