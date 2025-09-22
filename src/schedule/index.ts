import studentvue from "../lib/api/studentvue";
import { simplifyClassName } from "../lib/naming";
import { iterating } from "../lib/utils-xml";

export const getSchedule = async () => {
  const { StudentClassSchedule } = await studentvue("StudentClassList");
  const classList = iterating(StudentClassSchedule.ClassLists?.ClassListing);
  const todaySchedule = iterating(
    StudentClassSchedule.TodayScheduleInfoData?.SchoolInfos?.SchoolInfo?.Classes?.ClassInfo,
  );

  const periods = classList.map((c: any) => {
    const timing = todaySchedule.find((t) => t["@_SectionGU"] == c["@_SectionGU"]);
    const period = c["@_Period"].includes("-") ? +c["@_Period"].split("-")[0] : +c["@_Period"];

    return {
      name: simplifyClassName(c["@_CourseTitle"]),
      period,
      id: c["@_SectionGU"],
      teacher: c["@_Teacher"],
      startTime: (timing && timing["@_StartDate"] && new Date(timing["@_StartDate"])) || undefined,
      endTime: (timing && timing["@_EndDate"] && new Date(timing["@_EndDate"])) || undefined,
    };
  });

  return periods;
};
