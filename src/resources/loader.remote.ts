import { fn } from "monoserve";
import { array, custom, object, record, string, type InferOutput } from "valibot";
import { createSchoology, fullAuth } from "../lib/api/schoology";

const section = object({ id: string(), section_school_code: string(), course_title: string() });
type Section = InferOutput<typeof section>;

const filterAssignments = (assignments: any[], todayRegex: RegExp) => {
  assignments = assignments.filter((a: any) => a.description || a.due || a.grading_category);
  assignments.sort((a: any, b: any) => {
    const isAToday = todayRegex.test(a.title);
    const isBToday = todayRegex.test(b.title);
    if (isAToday && !isBToday) return -1;
    if (!isAToday && isBToday) return 1;
    return +b.last_updated - +a.last_updated;
  });
  assignments = assignments.slice(0, 8);
  return assignments;
};
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
const genResources = async (assignments: any[], courseId: string, todayRegex: RegExp) => {
  assignments = filterAssignments(assignments, todayRegex);
  return {
    links: [
      {
        title: "Schoology",
        url: `https://nsd.schoology.com/course/${courseId}/materials`,
      },
    ],
    resources: assignments.map((a) => processAssignment(a, courseId)),
  };
};
export type ResourceData = Awaited<ReturnType<typeof genResources>>;
const loadSections = async (
  schoology: (req: Request) => any,
  {
    sections,
    predSubmitted,
    skipSubmittedCheck,
    todayRegex,
  }: {
    sections: Section[];
    predSubmitted: Record<string, string[]>;
    skipSubmittedCheck: Record<string, string[]>;
    todayRegex: RegExp;
  },
) => {
  const output: Record<string, ResourceData> = {};

  if (sections.length == 0) return output;

  const { response: responses }: { response: { body: { assignment: any[] } }[] } = await schoology(
    new Request(`https://api.schoology.com/v1/multiget`, {
      method: "POST",
      body: JSON.stringify({
        request: sections.map(
          ({ id }) => `/v1/sections/${id}/assignments?limit=100&with_attachments=1`,
        ),
      }),
      headers: { "Content-Type": "application/json" },
    }),
  );

  await Promise.all(
    responses.map(async ({ body: { assignment: assignments } }, idx) => {
      const { section_school_code, id } = sections[idx];
      output[section_school_code] = await genResources(assignments, id, todayRegex);
    }),
  );

  return output;
};

const regexp = custom<RegExp>((input): input is RegExp => input instanceof RegExp);
const schema = object({
  auth: fullAuth,
  predSections: array(section),
  // predSubmitted: record(string(), array(string())),
  // skipSubmittedCheck: record(string(), array(string())),
  todayRegex: regexp,
});
export default fn(schema, async ({ auth, predSections, todayRegex }) => {
  const predSubmitted: Record<string, string[]> = {};
  const skipSubmittedCheck: Record<string, string[]> = {}; // Not implemented yet
  const schoology = createSchoology(auth);
  const boundLoadSections = (sections: Section[]) =>
    loadSections(schoology, { sections, predSubmitted, skipSubmittedCheck, todayRegex });

  const outputPromise = boundLoadSections(predSections);
  const realSections = await schoology(
    new Request(`https://api.schoology.com/v1/users/${auth.userId}/sections`),
  ).then(({ section }) =>
    section
      .map(({ id, section_school_code, course_title }: Section) => ({
        id,
        section_school_code,
        course_title,
      }))
      .filter((s: Section) => s.id && s.section_school_code && s.course_title),
  );

  if (JSON.stringify(predSections) == JSON.stringify(realSections)) {
    return { resources: await outputPromise, sections: predSections };
  } else {
    return {
      resources: await boundLoadSections(realSections),
      sections: realSections,
    };
  }
});
