import { DavenPrompt } from "@/components/DavenPrompt";
import { OnboardingFooter } from "@/components/OnboardingFooter";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { OptionCard } from "@/components/OptionCard";
import { startPaths } from "@/data/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { colors } from "@/theme";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Path() {
  const { userId } = useAuth();
  const startPath = useOnboardingStore((state) => state.startPath);
  const setStartPath = useOnboardingStore((state) => state.setStartPath);
  const complete = useOnboardingStore((state) => state.complete);

  const handleContinue = () => {
    if (userId) complete(userId);
    router.replace("/");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <OnboardingHeader step={5} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 pt-8 gap-6">
          <DavenPrompt question="Where would you like to start?" />

          <View className="gap-3">
            {startPaths.map((path, index) => {
              const isSelected = startPath === path.id;
              return (
                <OptionCard
                  key={path.id}
                  index={index}
                  selected={isSelected}
                  onPress={() => setStartPath(path.id)}
                  className="flex-row items-center gap-3 px-5 py-4"
                >
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`font-manrope-extrabold text-body-lg ${
                          isSelected ? "text-macaw-blue-lip" : "text-text"
                        }`}
                      >
                        {path.title}
                      </Text>
                      {path.badge && (
                        <View className="bg-fox-orange rounded-full px-2 py-1">
                          <Text className="font-manrope-extrabold text-[10px] tracking-wide text-white">
                            {path.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="font-manrope-bold text-body text-text-2">
                      {path.description}
                    </Text>
                  </View>
                  {path.hebrew && (
                    <Text
                      className={`font-heebo text-[24px] ${
                        isSelected ? "text-macaw-blue" : "text-disabled"
                      }`}
                    >
                      {path.hebrew}
                    </Text>
                  )}
                </OptionCard>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <OnboardingFooter disabled={!startPath} onPress={handleContinue} />
    </SafeAreaView>
  );
}
