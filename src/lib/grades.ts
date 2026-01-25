import { studentvue } from "./api/studentvue";
import { simplifyClassName } from "./naming";
import { iterating } from "./utils-xml";
import type { ClassGrade } from "./types";

const possiblePointsPattern = /([0-9.]+) Points Possible$/;

const getGrade = (clazz: any): ClassGrade | undefined => {
  const isMissing = (item: { "@_Notes": string }) =>
    item["@_Notes"].includes("Missing") || item["@_Notes"].includes("Missed due date");
  const period = clazz["@_Period"].includes("-")
    ? +clazz["@_Period"].split("-")[0]
    : +clazz["@_Period"];
  const title = simplifyClassName(clazz["@_Title"]);
  const mark = clazz.Marks.Mark;

  if (!mark.Assignments) return undefined;

  const assignments = [];
  const futureAssignments = [];
  const failedAssignments = [];
  const reportedGrade = mark["@_CalculatedScoreRaw"]
    ? parseFloat(mark["@_CalculatedScoreRaw"])
    : undefined;

  const assignmentsOriginal = iterating(mark.Assignments.Assignment);
  const needsNote = assignmentsOriginal.some(isMissing);

  for (const item of assignmentsOriginal) {
    const perhapsIrrelevant = item["@_Notes"].includes("(Not For Grading)");
    const perhapsMissing = needsNote ? isMissing(item) : true;
    if (perhapsIrrelevant) continue;

    const name = item["@_Measure"].replace("&amp;", "&");

    if (item["@_Point"] != undefined) {
      // intentional: ungraded will not have, graded will have at least ""
      const earned = item["@_Point"] ? parseFloat(item["@_Point"]) : 0;
      const possible = parseFloat(item["@_PointPossible"]);
      const ogType = item["@_ScoreType"] != "Raw Score" ? item["@_ScoreType"] : undefined;
      const ogScore = item["@_ScoreType"] != "Raw Score" ? parseFloat(item["@_Score"]) : undefined;

      assignments.push({
        earned,
        possible,
        ogType,
        ogScore,
        name,
        // date: item["@_Date"],
        missing: perhapsMissing && earned == 0,
        category: item["@_Type"],
      });
      continue;
    }

    if (["Not Due", "Not Graded"].includes(item["@_DisplayScore"])) {
      const pointsString = item["@_Points"];
      const possibleMatch = pointsString.match(possiblePointsPattern);

      if (possibleMatch) {
        futureAssignments.push({
          points: parseFloat(possibleMatch[1]),
          category: item["@_Type"],
          name,
        });
        continue;
      } else if (pointsString == "Points Possible") {
        // 0/0
        continue;
      }
    }

    failedAssignments.push({ name, item });
  }

  let categories: ClassGrade["categories"] = {};
  let reportedCategories: ClassGrade["reportedCategories"] = {};
  if (mark.GradeCalculationSummary?.AssignmentGradeCalc) {
    const calcs = iterating(mark.GradeCalculationSummary.AssignmentGradeCalc);
    const assignmentsGrouped = Object.groupBy(assignments, (a) => a.category);

    for (const item of calcs.sort((a: Record<string, any>, b: Record<string, any>) => {
      const aWeight = +a["@_Weight"].slice(0, -1);
      const bWeight = +b["@_Weight"].slice(0, -1);
      return bWeight - aWeight;
    })) {
      const name = item["@_Type"];
      if (name == "TOTAL") continue;

      const reportedEarned = +item["@_Points"].replace(/,/g, "");
      const reportedPossible = +item["@_PointsPossible"].replace(/,/g, "");
      if (reportedPossible == 0) continue;

      let earned = (assignmentsGrouped[name] || []).reduce((acc, { earned }) => acc + earned, 0);
      let possible = (assignmentsGrouped[name] || []).reduce(
        (acc, { possible }) => acc + possible,
        0,
      );
      const earnedDelta = reportedEarned - earned;
      const possibleDelta = reportedPossible - possible;
      if (earnedDelta >= 0 && possibleDelta >= 0 && !(earnedDelta == 0 && possibleDelta == 0)) {
        assignments.unshift({
          earned: earnedDelta,
          possible: possibleDelta,
          name: "Ghost assignments",
          missing: false,
          category: name,
        });
        earned += earnedDelta;
        possible += possibleDelta;
      }
      const weight = +item["@_Weight"].slice(0, -1);

      categories[name] = {
        earned,
        possible,
        weight,
      };
      reportedCategories[name] = {
        earned: reportedEarned,
        possible: reportedPossible,
        weight,
      };
    }
  }

  const totalWeight = Object.values(categories).reduce((a, b) => a + b.weight, 0);
  if (totalWeight) {
    for (const category of Object.values(categories)) {
      category.weight /= totalWeight;
    }
  } else {
    categories = undefined;
    reportedCategories = undefined;
  }

  return {
    period,
    title,
    assignments,
    futureAssignments,
    failedAssignments,
    categories,
    reportedGrade,
    reportedCategories,
  };
};
export const originals: Record<string, any> = {};
export const getGrades = async () => {
  const gradebook = await studentvue("Gradebook");

  const periods: ClassGrade[] = [];

  for (const clazz of iterating(gradebook?.Gradebook?.Courses?.Course)) {
    const result = getGrade(clazz);
    // prevent NaNs
    if (result && result.assignments.length) {
      originals[result.period] = clazz;
      periods.push(result);
    }
  }

  return periods;
};
