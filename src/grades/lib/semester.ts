import { districtSemesters } from 'school-districts';
import { getLoginRecognized } from 'monoidentity';
import type { ClassGrade } from './types';
import { getPoints } from './utils';

export const getSemester = () => {
  const { email } = getLoginRecognized();
  const domain = email.split('@')[1];
  const semester = districtSemesters[domain];
  if (!semester) {
    throw new Error('No semester information found');
  }
  return semester;
};

export const getTimeBasedProgress = () => {
  const now = new Date();
  const semester = getSemester();
  const done = semester.filter((d) => d.getTime() < now.getTime()).length;
  const total = semester.length;
  return total > 0 ? done / total : 0;
};

export const getPointBasedProgress = (
  assignments: ClassGrade['assignments'],
  futureAssignments: ClassGrade['futureAssignments'],
  categories?: ClassGrade['categories'],
) => {
  if (!categories) {
    const possible = getPoints(assignments).possible;
    const futurePossible = futureAssignments.reduce((a, b) => a + b.points, 0);
    const total = possible + futurePossible;
    return total > 0 ? possible / total : 0;
  }
  let cumulativeProgress = 0;
  for (const [category, { possible, weight }] of Object.entries(categories)) {
    const futurePossible = futureAssignments
      .filter((a) => a.category == category)
      .reduce((a, b) => a + b.points, 0);
    const total = possible + futurePossible;
    if (total > 0) {
      cumulativeProgress += (possible / total) * weight;
    }
  }
  return cumulativeProgress;
};
