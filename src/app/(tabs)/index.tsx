import { CurrentLessonCard } from "@/components/CurrentLessonCard";
import { PlanLessonRow } from "@/components/PlanLessonRow";
import { ProgressRing } from "@/components/ProgressRing";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { learnerProgress } from "@/data/progress";
import { useOnboardingStore } from "@/store/onboardingStore";
import { colors } from "@/theme";
import type { LessonStatus } from "@/types/learning";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { VariableContextProvider } from "nativewind";
import { Image, ScrollView, Text, View } from "react-native";

const TODAY_PLAN_SIZE = 4;
// Height of the tallest bar in the "This week" chart.
const MAX_BAR_HEIGHT = 26;
const MIN_BAR_HEIGHT = 7;

export default function Home() {
  const { user } = useUser();
  const languageId = useOnboardingStore((state) => state.language);
  const language = languages.find((item) => item.id === languageId);

  const firstName = user?.firstName ?? user?.username ?? "friend";
  const avatar = user?.imageUrl ? { uri: user.imageUrl } : images.avatarPlaceholder;

  const { streakDays, xp, accuracy, completedLessonIds, weeklyMinutes, todayIndex } =
    learnerProgress;

  // The current lesson is the first one not completed yet (or the last, once all are done).
  const firstOpenIndex = lessons.findIndex((lesson) => !completedLessonIds.includes(lesson.id));
  const currentIndex = firstOpenIndex === -1 ? lessons.length - 1 : firstOpenIndex;
  const currentLesson = lessons[currentIndex];

  // Today's plan: a few lessons around the current one.
  const planStart = Math.max(0, Math.min(currentIndex - 2, lessons.length - TODAY_PLAN_SIZE));
  const todayPlan = lessons.slice(planStart, planStart + TODAY_PLAN_SIZE);

  const getStatus = (lessonId: string, index: number): LessonStatus => {
    if (completedLessonIds.includes(lessonId)) return "done";
    return index === currentIndex ? "now" : "locked";
  };

  const weeklyTotal = weeklyMinutes.reduce((sum, minutes) => sum + minutes, 0);
  const busiestDay = Math.max(...weeklyMinutes, 1);

  return (
    <View className="flex-1 bg-background pt-safe">
      <ScrollView contentContainerClassName="px-6 pt-4 pb-5">
        {/* Header: wordmark, streak and XP */}
        <View className="flex-row items-center justify-between">
          <Text className="font-unbounded text-[22px] text-feather-green">daven</Text>
          <View className="flex-row gap-2">
            <View className="flex-row items-center gap-2 h-9 px-3.5 rounded-2xl border-2 border-border bg-white">
              <Ionicons name="flame" size={16} color={colors.brand.foxOrange} />
              <Text className="font-manrope-extrabold text-[17px] text-fox-orange">{streakDays}</Text>
            </View>
            <View className="flex-row items-center gap-2 h-9 px-3.5 rounded-2xl border-2 border-border bg-white">
              <Ionicons name="star" size={17} color={colors.brand.beeYellow} />
              <Text className="font-manrope-extrabold text-[17px] text-headings">{xp}</Text>
            </View>
          </View>
        </View>

        {/* Signed-in user (Clerk) and their language (Zustand, synced with Convex) */}
        <View className="flex-row items-center gap-3 mt-4">
          <Image source={avatar} className="w-10 h-10 rounded-full bg-surface" />
          <View className="flex-1">
            <Text className="font-manrope-extrabold text-body-lg leading-[22px] text-headings" numberOfLines={1}>
              Shalom, {firstName}
            </Text>
            <Text className="font-manrope-semibold text-caption text-text-2">
              Prayers explained in {language?.name ?? "English"}
            </Text>
          </View>
        </View>

        <View className="mt-4">
          <CurrentLessonCard
            lesson={currentLesson}
            lessonNumber={currentIndex + 1}
            totalLessons={lessons.length}
            completedCount={completedLessonIds.length}
            onStart={() => router.push("/learn")}
          />
        </View>

        {/* Stats */}
        <View className="flex-row gap-2.5 mt-[18px]">
          <View className="flex-1 flex-row items-center gap-3.5 px-3.5 option-card">
            <ProgressRing progress={accuracy / 100} />
            <View className="gap-0.5">
              <Text className="font-unbounded text-[22px] leading-[24px] text-headings">{accuracy}%</Text>
              <Text className="font-manrope-bold text-body text-text-2">Accuracy</Text>
            </View>
          </View>

          <View className="flex-1 px-3.5 py-3.5 option-card">
            <View className="flex-row items-end gap-1 h-[26px]">
              {weeklyMinutes.map((minutes, index) => {
                const barHeight = Math.max(
                  MIN_BAR_HEIGHT,
                  Math.round((minutes / busiestDay) * MAX_BAR_HEIGHT),
                );
                return (
                  // The height is calculated at runtime, so it reaches the className as a CSS variable.
                  <VariableContextProvider key={index} value={{ "--bar-height": `${barHeight}px` }}>
                    <View
                      className={`flex-1 h-(--bar-height) rounded-[5px] ${
                        index === todayIndex
                          ? "bg-feather-green"
                          : minutes === 0
                            ? "bg-divider"
                            : "bg-border"
                      }`}
                    />
                  </VariableContextProvider>
                );
              })}
            </View>
            <View className="flex-row items-end gap-1 mt-3">
              <Text className="font-unbounded text-[22px] leading-[24px] text-headings">{weeklyTotal}</Text>
              <Text className="font-manrope-extrabold text-body text-text">min</Text>
            </View>
            <Text className="mt-1 font-manrope-bold text-body text-text-2">This week</Text>
          </View>
        </View>

        {/* Today's plan */}
        <View className="mt-[18px]">
          {todayPlan.map((lesson, index) => {
            const lessonIndex = planStart + index;
            return (
              <PlanLessonRow
                key={lesson.id}
                number={lessonIndex + 1}
                title={lesson.title}
                status={getStatus(lesson.id, lessonIndex)}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
