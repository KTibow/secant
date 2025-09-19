export const ordinal = (n: number) => {
  if (n == 0) return "0";
  if (n == 1) return n + "st";
  if (n == 2) return n + "nd";
  if (n == 3) return n + "rd";
  return n + "th";
};
