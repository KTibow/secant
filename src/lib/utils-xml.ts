export const first = <T>(thing: T | T[]) => (Array.isArray(thing) ? thing[0] : thing);
export const iterating = <T>(thing: T | T[]) =>
  Array.isArray(thing) ? thing : !thing ? [] : [thing];
