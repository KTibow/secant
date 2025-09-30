import { fn } from "monoserve";
import { array, custom, object, optional, string, type InferOutput } from "valibot";
import { createSchoology, fullAuth } from "../lib/api/schoology";

const section = object({ id: string(), section_school_code: string(), course_title: string() });
type Section = InferOutput<typeof section>;

const processAssignment = (assignment: any, courseId: string) => {
  let icon = "none";
  if (assignment.type == "assessment" || assignment.type == "assessment_v2") {
    icon = "test";
  }
  if (assignment.assignment_type == "lti_submission") {
    icon = "worksheet";
  }

  let text: string | undefined;
  if (/^HW #(\d+)/.test(assignment.title)) {
    text = assignment.description;
  }
  if (text) {
    text = text.replace(/^HW #\d+ /, "");
    text = text.replace(/^\(\d+\.\d+\)\s/, "");
    text = text.replace(/^\(\d+\.\d+ and \d+\.\d+\)\s/, "");
    text = text.replace(/^Read \d+-\d+\n/, "");
    if (text.includes("Do ")) {
      text = text.slice(text.indexOf("Do "));
    }
    if (text.includes("DO ")) {
      text = text.slice(text.indexOf("DO "));
    }
  }
  return {
    url:
      assignment.type == "assignment"
        ? `https://nsd.schoology.com/assignment/${assignment.id}/info`
        : assignment.type == "assessment"
          ? `https://nsd.schoology.com/assignment/${assignment.id}/assessment_view`
          : assignment.type == "assessment_v2"
            ? `https://nsd.schoology.com/course/${courseId}/assessments/${assignment.id}`
            : "",
    icon,
    title: assignment.title,
    text,
  };
};
const processResources = (assignments: any[], courseId: string, todayRegex: RegExp) => {
  const links = [
    {
      title: "Schoology",
      url: `https://nsd.schoology.com/course/${courseId}/materials`,
    },
  ];
  const resources = assignments
    .filter((a: any) => a.description || a.due || a.grading_category)
    .sort((a: any, b: any) => {
      const isAToday = todayRegex.test(a.title);
      const isBToday = todayRegex.test(b.title);
      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;
      return +b.last_updated - +a.last_updated;
    })
    .map((a) => processAssignment(a, courseId))
    .slice(0, 8);

  return {
    links,
    resources,
  };
};
export type ResourceData = ReturnType<typeof processResources>;
const loadSections = async (
  sections: Section[],
  schoology: (req: Request) => any,
  todayRegex: RegExp,
) => {
  const output: Record<string, ReturnType<typeof processResources>> = {};

  if (sections.length == 0) return output;

  const body = {
    request: sections.map(
      ({ id }) => `/v1/sections/${id}/assignments?limit=100&with_attachments=1`,
    ),
  };
  const mgResponse: { response: { body: { assignment: any[] } }[] } = await schoology(
    new Request(`https://api.schoology.com/v1/multiget`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  );

  mgResponse.response.forEach(({ body: { assignment: assignments } }, idx) => {
    const { section_school_code, id } = sections[idx];
    output[section_school_code] = processResources(assignments, id, todayRegex);
  });

  return output;
};

const regexp = custom<RegExp>((input): input is RegExp => input instanceof RegExp);
const schema = object({
  auth: fullAuth,
  predSections: optional(array(section)),
  todayRegex: regexp,
});
export default fn(schema, async ({ auth, predSections, todayRegex }) => {
  const schoology = createSchoology(auth);

  const [output, realSections] = await Promise.all([
    loadSections(predSections ?? [], schoology, todayRegex),
    schoology(new Request(`https://api.schoology.com/v1/users/${auth.userId}/sections`)).then(
      ({ section }) =>
        section
          .map(({ id, section_school_code, course_title }: Section) => ({
            id,
            section_school_code,
            course_title,
          }))
          .filter((s: Section) => s.id && s.section_school_code && s.course_title),
    ),
  ]);

  if (JSON.stringify(predSections) == JSON.stringify(realSections)) {
    return { resources: output, sections: predSections };
  } else {
    return {
      resources: await loadSections(realSections, schoology, todayRegex),
      sections: realSections,
    };
  }
});
