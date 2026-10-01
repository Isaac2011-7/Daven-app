import type { LearnerProgress } from "@/types/learning";

/** Mock learner progress until lesson completion and XP are tracked for real. */
export const learnerProgress: LearnerProgress = {
  streakDays: 7,
  xp: 240,
  accuracy: 82,
  completedLessonIds: ["modeh-ani", "netilat-yadayim"],
  weeklyMinutes: [5, 9, 3, 11, 6, 8, 0],
  todayIndex: 3,
};
