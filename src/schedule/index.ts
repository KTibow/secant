import { studentvue } from '../lib/api/studentvue';
import { simplifyClassName } from '../lib/naming';
import { iterating } from '../lib/utils-xml';

export const getSchedule = async () => {
  const { StudentClassSchedule } = await studentvue('StudentClassList');
  const classList = iterating(StudentClassSchedule.ClassLists?.ClassListing);
  const todaySchedule = iterating(
    StudentClassSchedule.TodayScheduleInfoData?.SchoolInfos?.SchoolInfo?.Classes?.ClassInfo,
  );

  const periods = classList.map((c: any) => {
    let startTime: Date | undefined;
    let endTime: Date | undefined;
    for (const s of todaySchedule) {
      if (s['@_SectionGU'] == c['@_SectionGU']) {
        if (s['@_StartDate']) startTime ||= new Date(s['@_StartDate']);
        if (s['@_EndDate']) endTime = new Date(s['@_EndDate']);
      }
    }
    return {
      name: simplifyClassName(c['@_CourseTitle']),
      period: c['@_Period'].includes('-') ? +c['@_Period'].split('-')[0] : +c['@_Period'],
      id: c['@_SectionGU'],
      // teacher: c["@_Teacher"],
      startTime,
      endTime,
    };
  });

  return periods;
};
