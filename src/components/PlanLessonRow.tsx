import type { LessonStatus } from "@/types/learning";
import { Text, View } from "react-native";

type Props = {
  number: number;
  title: string;
  status: LessonStatus;
};

const statusClasses: Record<
  LessonStatus,
  { label: string; number: string; title: string; badge: string; badgeText: string }
> = {
  done: {
    label: "DONE",
    number: "text-feather-green",
    title: "text-headings",
    badge: "bg-feather-green-pale",
    badgeText: "text-feather-green-lip",
  },
  now: {
    label: "NOW",
    number: "text-fox-orange",
    title: "text-headings",
    badge: "bg-fox-orange",
    badgeText: "text-white",
  },
  locked: {
    label: "LOCKED",
    number: "text-disabled",
    title: "text-disabled",
    badge: "bg-surface",
    badgeText: "text-disabled",
  },
};

/** One lesson in today's plan list on Home, with its status badge. */
export function PlanLessonRow({ number, title, status }: Props) {
  const classes = statusClasses[status];

  return (
    <View className="flex-row items-center h-12 px-1 border-b-2 border-divider">
      <Text className={`w-[34px] font-unbounded text-[16px] ${classes.number}`}>{number}</Text>
      <Text className={`flex-1 font-manrope-extrabold text-body-lg ${classes.title}`} numberOfLines={1}>
        {title}
      </Text>
      <View className={`px-2.5 py-1 rounded-[10px] ${classes.badge}`}>
        <Text className={`font-manrope-extrabold text-label tracking-label ${classes.badgeText}`}>
          {classes.label}
        </Text>
      </View>
    </View>
  );
}
