import type { ClassGrade } from "../grades/lib/types";

type Class = {
  period: number;
  name: string;
  grade?: ClassGrade;
  startTime?: Date;
  endTime?: Date;
};

export const combine = (schedule?: Class[], grades?: ClassGrade[]) => {
  const output: Record<number, Class> = {};
  if (schedule) {
    for (const clazz of schedule) {
      output[clazz.period] ||= {
        period: clazz.period,
        name: clazz.name,
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
  return Object.values(output).sort((a, b) => a.period - b.period);
};
