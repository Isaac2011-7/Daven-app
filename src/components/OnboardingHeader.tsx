import { ONBOARDING_TOTAL_STEPS } from "@/data/onboarding";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type Props = {
  step: number;
  showCount?: boolean;
};

export function OnboardingHeader({ step, showCount = false }: Props) {
  // Start from the previous step so the bar visibly fills forward on arrival.
  const progress = useSharedValue((step - 1) / ONBOARDING_TOTAL_STEPS);

  useEffect(() => {
    progress.set(withSpring(step / ONBOARDING_TOTAL_STEPS, { damping: 18, stiffness: 120 }));
  }, [step, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.get() * 100}%`,
  }));

  return (
    <View className="flex-row items-center gap-4 px-6 pt-2">
      <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
        <Ionicons name="chevron-back" size={24} color={colors.neutral.text2} />
      </TouchableOpacity>
      <View className="flex-1 h-3 rounded-full bg-border overflow-hidden">
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
      {showCount && (
        <Text className="font-manrope-extrabold text-label text-disabled">
          {step}/{ONBOARDING_TOTAL_STEPS}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.brand.featherGreen,
  },
});
