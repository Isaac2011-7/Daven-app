import type { Lesson } from "@/types/learning";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  lesson: Lesson;
  lessonNumber: number;
  totalLessons: number;
  completedCount: number;
  onStart: () => void;
};

/** Big green card on Home showing the lesson to do next. */
export function CurrentLessonCard({ lesson, lessonNumber, totalLessons, completedCount, onStart }: Props) {
  return (
    <View className="bg-feather-green btn-lip-green rounded-3xl px-5 pt-[22px] pb-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-manrope-extrabold text-label tracking-label text-white/90">
          LESSON {lessonNumber} OF {totalLessons}
        </Text>
        <Text className="font-manrope-extrabold text-label tracking-label text-white/90">
          {lesson.minutes} MIN
        </Text>
      </View>

      <Text className="self-end mt-3 font-heebo text-[52px] leading-[66px] text-white">
        {lesson.hebrew}
      </Text>

      <Text
        className="mt-1 font-unbounded text-[28px] leading-[34px] text-white"
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {lesson.fullTitle}
      </Text>

      {/* One segment per lesson in the path; filled ones are completed. */}
      <View className="flex-row gap-1 mt-3">
        {Array.from({ length: totalLessons }, (_, index) => (
          <View
            key={index}
            className={`flex-1 h-1.5 rounded-full ${index < completedCount ? "bg-white" : "bg-white/35"}`}
          />
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onStart}
        className="mt-3 h-12 items-center justify-center rounded-2xl bg-white btn-lip-gray"
      >
        <Text className="font-manrope-extrabold text-[15px] tracking-label text-feather-green">
          START LESSON
        </Text>
      </TouchableOpacity>
    </View>
  );
}
