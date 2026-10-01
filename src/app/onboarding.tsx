import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { colors } from "@/theme";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const letterChips = [
  {
    letter: "א",
    position: "-top-3 -left-3",
    rotate: "-rotate-6",
    bg: "bg-macaw-blue-light",
    text: "text-macaw-blue-lip",
  },
  {
    letter: "ש",
    position: "-top-3 -right-3",
    rotate: "rotate-6",
    bg: "bg-bee-yellow-light",
    text: "text-bee-yellow-lip",
  },
  {
    letter: "ל",
    position: "-bottom-3 -left-3",
    rotate: "rotate-6",
    bg: "bg-feather-green-light",
    text: "text-feather-green-lip",
  },
  {
    letter: "ב",
    position: "-bottom-3 -right-3",
    rotate: "-rotate-6",
    bg: "bg-fox-orange-light",
    text: "text-fox-orange-lip",
  },
];

const waveformBars = ["h-6", "h-10", "h-14", "h-10", "h-6"];
const waveformBarsCompact = ["h-4", "h-6", "h-8", "h-6", "h-4"];

export default function Onboarding() {
  const isCompact = useIsCompactScreen();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 w-full px-8 items-center">
          <View
            className={`relative items-center justify-center self-center ${
              isCompact ? "w-44 h-44 mt-4" : "w-64 h-64 mt-16"
            }`}
          >
            {letterChips.map((chip, index) => (
              <Animated.View
                key={chip.letter}
                entering={ZoomIn.delay(300 + index * 120).springify().damping(10)}
                className={`absolute ${chip.position} ${chip.rotate} ${chip.bg} items-center justify-center ${
                  isCompact ? "w-12 h-12 rounded-xl" : "w-[72px] h-[72px] rounded-2xl"
                }`}
              >
                <Text className={`font-heebo ${chip.text} ${isCompact ? "text-lg" : "text-[32px]"}`}>
                  {chip.letter}
                </Text>
              </Animated.View>
            ))}

            <Animated.View
              entering={ZoomIn.springify().damping(12)}
              className={`bg-feather-green btn-lip-green items-center justify-center ${
                isCompact ? "w-24 h-24 rounded-[20px]" : "w-[136px] h-[136px] rounded-[32px]"
              }`}
            >
              <View className="flex-row items-center gap-2">
                {(isCompact ? waveformBarsCompact : waveformBars).map((heightClass, index) => (
                  <View key={index} className={`w-[7px] ${heightClass} rounded-full bg-white`} />
                ))}
              </View>
            </Animated.View>
          </View>

          <Text
            className={`font-unbounded text-feather-green ${
              isCompact ? "text-display mt-4" : "text-hero mt-10"
            }`}
          >
            daven
          </Text>

          <Text
            className={`font-manrope-bold text-body-lg text-headings text-center px-4 ${
              isCompact ? "mt-2" : "mt-4"
            }`}
          >
            Learn to pray with confidence, one line at a time.
          </Text>

          <View className="flex-1" />

          <Animated.View
            entering={FadeInDown.delay(700).springify().damping(16)}
            className={`w-full gap-3 ${isCompact ? "mb-2" : "mb-4"}`}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/sign-up")}
              className={`bg-feather-green btn-lip-green rounded-2xl items-center ${
                isCompact ? "py-3" : "py-4"
              }`}
            >
              <Text className="font-manrope-extrabold text-label tracking-label text-white">
                GET STARTED
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/sign-in")}
              className={`bg-white border border-border rounded-2xl items-center ${
                isCompact ? "py-3" : "py-4"
              }`}
            >
              <Text className="font-manrope-extrabold text-label tracking-label text-macaw-blue">
                I ALREADY HAVE AN ACCOUNT
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
