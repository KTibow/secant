export const simplifyCategory = /* @__PURE__ */ (name: string) => {
  name = name.toLowerCase();

  if (name.includes("formative")) return "assignment";
  if (name.includes("homework")) return "assignment";
  if (name.includes("classwork")) return "assignment";
  if (name.includes("assignment")) return "assignment";
  if (name.includes("practice")) return "assignment";
  if (name.includes("daily work")) return "assignment";
  if (name.includes("participation")) return "assignment";
  if (name.includes("test")) return "test";
  if (name.includes("quiz")) return "test";
  if (name.includes("summative")) return "project";
  if (name.includes("project")) return "project";
  if (name.includes("lab")) return "project";
  if (name.includes("assessment")) return "test";

  return name;
};
export const shortenCategory = /* @__PURE__ */ (name: string) => {
  name = name.replace(/ APCS$/, "");
  name = name.replace("Labs/Projects/Presentations", "Labs/Projects");
  name = name.replace("Assessments, Quizzes, and Projects", "Tests/Projects");
  name = name.replace("Code Your Owns / Quizzes", "Tests/Projects");
  name = name.replace("Completion of Assignments/HW", "HW/Classwork");
  name = name.replace("Homework/Classwork", "HW/Classwork");
  name = name.replace("Classwork/Homework", "HW/Classwork");
  name = name.replace("Homework and Classwork", "HW/Classwork");
  name = name.replace("Classwork and Homework", "HW/Classwork");
  name = name.replace(/^summative assessments$/i, "Summative");
  name = name.replace(/^formative assessments$/i, "Formative");
  name = name.replace(/^summative assessment$/i, "Summative");
  name = name.replace(/^formative assessment$/i, "Formative");
  name = name.replace(/college and career readiness/i, "Life readiness");
  name = name.replace(/lab activities/i, "Labs");
  return name;
};
