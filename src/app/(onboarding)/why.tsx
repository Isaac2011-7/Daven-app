import { DavenPrompt } from "@/components/DavenPrompt";
import { OnboardingFooter } from "@/components/OnboardingFooter";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { OptionCard } from "@/components/OptionCard";
import { reasonOptions } from "@/data/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Why() {
  const reasons = useOnboardingStore((state) => state.reasons);
  const toggleReason = useOnboardingStore((state) => state.toggleReason);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <OnboardingHeader step={4} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 pt-8 gap-6">
          <DavenPrompt question="What brings you here?" hint="Pick all that fit." />

          <View className="gap-3">
            {reasonOptions.map((option, index) => {
              const isSelected = reasons.includes(option.id);
              return (
                <OptionCard
                  key={option.id}
                  index={index}
                  selected={isSelected}
                  onPress={() => toggleReason(option.id)}
                  className="flex-row items-center gap-4 px-5 py-5"
                >
                  <View
                    className={`w-7 h-7 rounded-lg items-center justify-center border-2 ${
                      isSelected ? "bg-macaw-blue border-macaw-blue" : "bg-white border-border"
                    }`}
                  >
                    {isSelected && (
                      <Animated.View entering={ZoomIn.springify().damping(12)}>
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </Animated.View>
                    )}
                  </View>
                  <Text
                    className={`flex-1 font-manrope-extrabold text-body-lg ${
                      isSelected ? "text-macaw-blue-lip" : "text-text"
                    }`}
                  >
                    {option.label}
                  </Text>
                </OptionCard>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <OnboardingFooter disabled={reasons.length === 0} onPress={() => router.push("/path")} />
    </SafeAreaView>
  );
}
