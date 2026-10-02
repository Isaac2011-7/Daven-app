import { DavenPrompt } from "@/components/DavenPrompt";
import { OnboardingFooter } from "@/components/OnboardingFooter";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { OptionCard } from "@/components/OptionCard";
import { languages } from "@/data/languages";
import { useOnboardingStore } from "@/store/onboardingStore";
import { colors } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageScreen() {
  const savedLanguage = useOnboardingStore((state) => state.language);
  const setLanguage = useOnboardingStore((state) => state.setLanguage);
  // Only saved to the store once they confirm with CONTINUE.
  const [selected, setSelected] = useState(savedLanguage);

  const handleContinue = () => {
    if (!selected) {
      return;
    }
    setLanguage(selected);
    router.push("/level");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <OnboardingHeader step={2} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 pt-8 gap-6">
          <DavenPrompt
            question="What language do you speak?"
            hint="We'll explain every prayer in it."
          />

          <View className="gap-3">
            {languages.map((language, index) => {
              const isSelected = selected === language.id;
              return (
                <OptionCard
                  key={language.id}
                  index={index}
                  selected={isSelected}
                  onPress={() => setSelected(language.id)}
                  className="flex-row items-center gap-3 px-5 py-4"
                >
                  <View className="flex-1 gap-1">
                    <Text
                      className={`font-manrope-extrabold text-body-lg ${
                        isSelected ? "text-macaw-blue-lip" : "text-text"
                      }`}
                    >
                      {language.nativeName}
                    </Text>
                    <Text className="font-manrope-bold text-body text-text-2">
                      {language.name}
                    </Text>
                  </View>
                  <Text
                    className={`font-manrope-extrabold text-label tracking-label ${
                      isSelected ? "text-macaw-blue" : "text-disabled"
                    }`}
                  >
                    {language.code}
                  </Text>
                </OptionCard>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <OnboardingFooter disabled={!selected} onPress={handleContinue} />
    </SafeAreaView>
  );
}
