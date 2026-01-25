import type { ClassGrade, ResourceData } from "./types";

export type Class = {
  period: number;
  name: string;
  id?: string;
  // teacher?: string;
  grade?: ClassGrade;
  resources?: ResourceData;
  startTime?: Date;
  endTime?: Date;
};

export const combine = (
  schedule?: Class[],
  grades?: ClassGrade[],
  resources?: Record<string, ResourceData>,
) => {
  const output: Record<number, Class> = {};
  if (schedule) {
    for (const clazz of schedule) {
      output[clazz.period] ||= {
        period: clazz.period,
        name: clazz.name,
        id: clazz.id,
        // teacher: clazz.teacher,
      };
      if (clazz.startTime) {
        output[clazz.period].startTime = clazz.startTime;
      }
      if (clazz.endTime) {
        output[clazz.period].endTime = clazz.endTime;
      }
    }
  }
  if (grades) {
    for (const grade of grades) {
      output[grade.period] ||= {
        period: grade.period,
        name: grade.title,
      };
      output[grade.period].grade = grade;
    }
  }
  if (resources) {
    for (const periodStr in output) {
      const period = Number(periodStr);
      const clazz = output[period];
      if (clazz.id && resources[clazz.id]) {
        clazz.resources = resources[clazz.id];
      }
    }
  }
  return output;
};
