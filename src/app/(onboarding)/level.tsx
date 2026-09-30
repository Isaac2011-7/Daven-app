import { LevelDial } from "@/components/LevelDial";
import { OnboardingFooter } from "@/components/OnboardingFooter";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { hebrewOptions, levels } from "@/data/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { colors } from "@/theme";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Level() {
  const level = useOnboardingStore((state) => state.level);
  const setLevel = useOnboardingStore((state) => state.setLevel);
  const setHebrewReading = useOnboardingStore((state) => state.setHebrewReading);
  const current = levels[level - 1];

  // Each level implies how well they read Hebrew, so the dial answers it too.
  const hebrew = hebrewOptions.find((option) => option.id === current.suggestedHebrew)!;

  const handleContinue = () => {
    setHebrewReading(hebrew.id);
    router.push("/why");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <OnboardingHeader step={3} showCount />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-8 pb-8">
          <View className="gap-2">
            <Text className="font-manrope-extrabold text-h1 text-headings">
              How much do you know?
            </Text>
            <Text className="font-manrope-bold text-body text-text-2">
              Turn the wheel to your level. We&apos;ll start your lessons in the right place.
            </Text>
          </View>

          <View className="mt-12 -mx-6">
            <LevelDial value={level} onChange={setLevel} />
          </View>

          <View className="min-h-[56px] items-center mt-2">
            <Animated.View
              key={level}
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(120)}
            >
              <Text className="font-manrope-medium text-body-lg text-text-2 text-center">
                {current.description}
              </Text>
            </Animated.View>
          </View>

          {/* Hebrew reading, set by the dial */}
          <View className="mt-6 bg-surface rounded-3xl px-5 py-4">
            <Text className="font-manrope-extrabold text-label tracking-label text-text-2">
              READING HEBREW
            </Text>
            <Animated.View
              key={hebrew.id}
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(120)}
              className="flex-row items-center gap-4 mt-3"
            >
              <View className="min-w-[72px] h-14 px-3 rounded-2xl bg-white items-center justify-center">
                <Text className="font-heebo text-[24px] text-feather-green">{hebrew.hebrew}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-manrope-extrabold text-body-lg text-headings">
                  {hebrew.title}
                </Text>
                <Text className="font-manrope-bold text-body text-text-2">
                  {hebrew.description}
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
      <OnboardingFooter showArrow onPress={handleContinue} />
    </SafeAreaView>
  );
}
