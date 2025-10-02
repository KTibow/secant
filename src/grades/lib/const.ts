/**
 * The grade floor used throughout the application.
 */
export const GRADE_FLOOR = 0.0;

/**
 * The grade ceiling (maximum grade before floor adjustment)
 * Used for calculating adjusted percentages in grade bars
 */
const GRADE_CEILING = 1.0;

/**
 * The grade range after applying the floor
 * This is the effective range for grade calculations
 */
export const GRADE_RANGE = GRADE_CEILING - GRADE_FLOOR;

/**
 * Utility function to calculate adjusted percentage for grade display
 * @param percent - The raw percentage (0-1)
 * @returns The adjusted percentage accounting for the grade floor
 */
export const getAdjustedPercent = (percent: number): number => {
  return (percent - GRADE_FLOOR) / GRADE_RANGE;
};

/**
 * Utility function to calculate the minimum possible grade given a variable component
 * @param fixedPercent - The fixed portion of the grade
 * @param variablePercent - The variable portion of the grade
 * @returns The minimum possible grade accounting for the grade floor
 */
export const getMinimumGrade = (fixedPercent: number, variablePercent: number): number => {
  return fixedPercent + GRADE_FLOOR * variablePercent;
};
