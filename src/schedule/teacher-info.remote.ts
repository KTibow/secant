import { fn } from "monoserve";
import { string, array } from "valibot";

export type TeacherInfo = {
  teacher: string;
  isSubbed: boolean;
  isBirthday: boolean;
};

export default fn(array(string()), async (teachers): Promise<TeacherInfo[]> => {
  try {
    // @ts-ignore works in production
    const { default: checkTeacherInfo } = await import("./teacher-info-impl.private");
    return await checkTeacherInfo(teachers);
  } catch {}

  return teachers.map((teacher) => ({
    teacher,
    isSubbed: false,
    isBirthday: false,
  }));
});
