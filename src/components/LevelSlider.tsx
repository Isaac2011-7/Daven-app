import { levels } from "@/data/onboarding";
import { colors } from "@/theme";
import { useEffect, useMemo, useState } from "react";
import { PanResponder, Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/*
 * Discrete slider modelled on Material 3 Expressive: a thick rounded track,
 * a thin vertical handle with a gap cut into the track on each side, and stop
 * dots at every level. A bar graph sits on top, one bar per stop, so the
 * level reads like a rising scale.
 */
// Sizes used in calculations. The track (h-5), handle (h-11) and bar (w-9 = BAR_WIDTH)
// sizes are written as classes in the JSX — keep them in sync.
const HANDLE_WIDTH = 4;
const HANDLE_GAP = 6;
const TRACK_INSET = 18; // half a bar, so the end bars and stops line up with the edges
const STOP_SIZE = 4;
const GRAPH_HEIGHT = 110;
const BAR_WIDTH = 36;
const BAR_HEIGHTS = [0.22, 0.4, 0.58, 0.78, 1]; // share of GRAPH_HEIGHT
const SPRING = { damping: 18, stiffness: 220, mass: 0.7 };
const lastIndex = levels.length - 1;

type Props = {
  value: number;
  onChange: (value: number) => void;
};

type BarProps = {
  index: number;
  value: number;
  left: number;
  onPress: () => void;
};

/** One bar of the graph: grows slightly and turns green when it's the selected level. */
function GraphBar({ index, value, left, onPress }: BarProps) {
  const level = index + 1;
  const target = level === value ? 2 : level < value ? 1 : 0; // 0 above, 1 below, 2 selected
  const state = useSharedValue(target);

  useEffect(() => {
    state.set(withTiming(target, { duration: 180 }));
  }, [target, state]);

  const barStyle = useAnimatedStyle(() => ({
    height: GRAPH_HEIGHT * BAR_HEIGHTS[index] + Math.max(state.get() - 1, 0) * 6,
    backgroundColor: interpolateColor(
      state.get(),
      [0, 1, 2],
      [colors.neutral.border, colors.brand.featherGreenLight, colors.brand.featherGreen],
    ),
  }));

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className="absolute bottom-0 w-9 h-full justify-end"
      style={{ left: left - BAR_WIDTH / 2 }}
    >
      <Animated.View className="w-9 rounded-[10px]" style={barStyle} />
    </Pressable>
  );
}

export function LevelSlider({ value, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const progress = useSharedValue((value - 1) / lastIndex);
  const grab = useSharedValue(0);
  const dragging = useSharedValue(false);

  // Glide to the new stop when the value changes from outside a drag.
  useEffect(() => {
    if (!dragging.get()) {
      progress.set(withSpring((value - 1) / lastIndex, SPRING));
    }
  }, [value, progress, dragging]);

  const range = Math.max(width - TRACK_INSET * 2, 0);
  const stopX = (index: number) => TRACK_INSET + (index / lastIndex) * range;

  const panResponder = useMemo(() => {
    const follow = (x: number) => {
      const ratio = Math.min(Math.max((x - TRACK_INSET) / range, 0), 1);
      progress.set(ratio);
      onChange(Math.round(ratio * lastIndex) + 1);
    };

    const release = () => {
      dragging.set(false);
      grab.set(withSpring(0, SPRING));
      progress.set(withSpring(Math.round(progress.get() * lastIndex) / lastIndex, SPRING));
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => range > 0,
      onMoveShouldSetPanResponder: () => range > 0,
      onPanResponderGrant: (event) => {
        dragging.set(true);
        grab.set(withSpring(1, SPRING));
        follow(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => follow(event.nativeEvent.locationX),
      onPanResponderRelease: release,
      onPanResponderTerminate: release,
    });
  }, [range, onChange, progress, grab, dragging]);

  const activeStyle = useAnimatedStyle(() => {
    const handleX = TRACK_INSET + progress.get() * range;
    return { width: Math.max(handleX - HANDLE_WIDTH / 2 - HANDLE_GAP, 0) };
  });

  const inactiveStyle = useAnimatedStyle(() => {
    const handleX = TRACK_INSET + progress.get() * range;
    return { left: Math.min(handleX + HANDLE_WIDTH / 2 + HANDLE_GAP, width) };
  });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: TRACK_INSET + progress.get() * range - HANDLE_WIDTH / 2 },
      { scaleX: 1 + grab.get() * 0.5 },
    ],
  }));

  return (
    <View>
      <View className="h-[116px] mb-3">
        {width > 0 &&
          levels.map((level, index) => (
            <GraphBar
              key={level.value}
              index={index}
              value={value}
              left={stopX(index)}
              onPress={() => onChange(level.value)}
            />
          ))}
      </View>

      <View
        className="h-11"
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <Animated.View
          pointerEvents="none"
          className="absolute bottom-3 left-0 h-5 bg-feather-green rounded-l-[10px] rounded-r-[4px]"
          style={activeStyle}
        />
        <Animated.View
          pointerEvents="none"
          className="absolute bottom-3 right-0 h-5 bg-feather-green-light rounded-r-[10px] rounded-l-[4px]"
          style={inactiveStyle}
        />

        {levels.map((level, index) => {
          if (level.value === value) return null;
          return (
            <View
              key={level.value}
              pointerEvents="none"
              className={`absolute bottom-5 w-1 h-1 rounded-full ${
                level.value < value ? "bg-feather-green-light" : "bg-feather-green"
              }`}
              style={{ left: stopX(index) - STOP_SIZE / 2 }}
            />
          );
        })}

        <Animated.View
          pointerEvents="none"
          className="absolute left-0 bottom-0 w-1 h-11 rounded-full bg-feather-green-lip"
          style={handleStyle}
        />
      </View>

      <View className="flex-row justify-between mt-1">
        <Text className="font-manrope-bold text-caption text-text-2">Brand new</Text>
        <Text className="font-manrope-bold text-caption text-text-2">Fluent</Text>
      </View>
    </View>
  );
}
