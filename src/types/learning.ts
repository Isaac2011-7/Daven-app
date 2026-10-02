export type Lesson = {
  id: string;
  /** Short name used in lists, e.g. "Shema" */
  title: string;
  /** Full prayer name shown on the current lesson card, e.g. "Shema Yisrael" */
  fullTitle: string;
  hebrew: string;
  minutes: number;
};

export type LessonStatus = "done" | "now" | "locked";

export type LearnerProgress = {
  streakDays: number;
  xp: number;
  /** Percent of words said correctly in practice, 0-100 */
  accuracy: number;
  completedLessonIds: string[];
  /** Minutes practiced on each day of this week, Monday first */
  weeklyMinutes: number[];
  /** Index into weeklyMinutes for today */
  todayIndex: number;
};
