import { getLoginRecognized, relog } from 'monoidentity';
import fastStudentvue from 'fast-studentvue';

let authFails = 0;
export const studentvue = (methodName: string, params?: Record<string, string>) => {
  let login: { email: string; password: string };
  try {
    login = getLoginRecognized();
  } catch {
    relog();
  }
  return fastStudentvue(
    login,
    () => {
      authFails++;
      if (authFails < 3) {
        throw new Error('Invalid auth, will relog soon');
      }
      console.trace('Relogging');
      relog();
    },
    methodName,
    params,
  );
};
