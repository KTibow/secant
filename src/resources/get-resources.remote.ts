import { SC_KEY, SC_SECRET } from "$env/static/private";
import fn from "monoserve/fn";
import { decode } from "monoidentity";
import { object, string, union, literal } from "valibot";
import Schoology from "../lib/api/schoology";

const processAssignment = (assignment: any, courseId: number) => {
  return {
    url:
      assignment.type == "assignment"
        ? `https://nsd.schoology.com/assignment/${assignment.id}/info`
        : assignment.type == "assessment"
          ? `https://nsd.schoology.com/assignment/${assignment.id}/assessment_view`
          : assignment.type == "assessment_v2"
            ? `https://nsd.schoology.com/course/${courseId}/assessments/${assignment.id}`
            : "",
    icon: "offline",
    title: assignment.title,
  };
};
const processResources = (assignments: any[], courseId: number, todayRegex: RegExp) => {
  const resources = assignments
    .filter((a: any) => a.description || a.due || a.grading_category)
    .sort((a: any, b: any) => {
      const isAToday = todayRegex.test(a.title);
      const isBToday = todayRegex.test(b.title);
      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;
      return +b.last_updated - +a.last_updated;
    })
    .map((a) => processAssignment(a, courseId));

  return {
    resources,
  };
};

export default fn(
  object({
    token: object({ key: string(), secret: string() }),
    tokenFor: union([literal("app"), literal("user")]),
    userId: string(),
    todayRegex: string(),
  }),
  async ({ token, tokenFor, userId, todayRegex }) => {
    token.key = decode(token.key);
    token.secret = decode(token.secret);
    let makeRequest: (request: Request) => Promise<any>;
    if (tokenFor == "app") {
      const client = new Schoology(token.key, token.secret);
      makeRequest = (request: Request) => client.makeRequest(request);
    } else {
      const client = new Schoology(SC_KEY, SC_SECRET);
      makeRequest = (request: Request) => client.makeRequest(request, token);
    }

    const sections = await makeRequest(
      new Request(`https://api.schoology.com/v1/users/${userId}/sections`),
    );
    console.log(sections);
    // todo log sections and track perf
  },
);
