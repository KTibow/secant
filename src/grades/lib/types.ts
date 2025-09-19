export type Assignment = {
  earned: number;
  possible: number;
  name: string;
  date?: string;
  missing: boolean;
  category: string;
};
export type ClassGrade = {
  period: number;
  title: string;
  assignments: Assignment[];
  futureAssignments: {
    points: number;
    category: string;
    name: string;
  }[];
  failedAssignments?: { name: string }[];
  categories?: Record<
    string,
    {
      earned: number;
      possible: number;
      weight: number;
    }
  >;
  reportedGrade?: number;
  reportedCategories?: Record<
    string,
    {
      earned: number;
      possible: number;
      weight: number;
    }
  >;
  _original?: any;
};
