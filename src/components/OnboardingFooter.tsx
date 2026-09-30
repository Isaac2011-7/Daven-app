import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const SPRING = { damping: 14, stiffness: 240, mass: 0.7 };

type Props = {
  onPress: () => void;
  disabled?: boolean;
  showArrow?: boolean;
};

export function OnboardingFooter({ onPress, disabled = false, showArrow = false }: Props) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <View className="px-6 pt-4 pb-4 border-t-2 border-border">
      <Animated.View style={pressStyle}>
        <Pressable
          disabled={disabled}
          onPress={onPress}
          onPressIn={() => scale.set(withSpring(0.96, SPRING))}
          onPressOut={() => scale.set(withSpring(1, SPRING))}
          className={`rounded-2xl py-4 flex-row items-center justify-center gap-2 ${
            disabled ? "bg-border" : "bg-feather-green btn-lip-green"
          }`}
        >
          <Text
            className={`font-manrope-extrabold text-label tracking-label ${
              disabled ? "text-disabled" : "text-white"
            }`}
          >
            CONTINUE
          </Text>
          {showArrow && <Ionicons name="arrow-forward" size={16} color="#fff" />}
        </Pressable>
      </Animated.View>
    </View>
  );
}
