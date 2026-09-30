import { ReactNode } from "react";
import { Pressable } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SPRING = { damping: 14, stiffness: 240, mass: 0.7 };

type Props = {
  selected: boolean;
  onPress: () => void;
  index?: number;
  className?: string;
  wrapperStyle?: object;
  children: ReactNode;
};

/** Selectable onboarding card: staggers in on mount and squishes when pressed. */
export function OptionCard({
  selected,
  onPress,
  index = 0,
  className = "",
  wrapperStyle,
  children,
}: Props) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).springify().damping(16)}
      style={[wrapperStyle, pressStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => scale.set(withSpring(0.97, SPRING))}
        onPressOut={() => scale.set(withSpring(1, SPRING))}
        className={`${selected ? "option-card-selected" : "option-card"} ${className}`}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
