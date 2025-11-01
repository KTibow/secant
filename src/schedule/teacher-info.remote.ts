import { fn } from "monoserve";
import { string, array } from "valibot";

export default fn(array(string()), async (teachers): Promise<string[]> => {
  try {
    // @ts-ignore works in production
    const { default: checkTeacherInfo } = await import("./teacher-info-impl.private");
    return await checkTeacherInfo(teachers);
  } catch {}

  return [];
});
