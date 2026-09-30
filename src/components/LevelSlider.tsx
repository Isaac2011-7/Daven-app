import { levels } from "@/data/onboarding";
import { colors } from "@/theme";
import { useEffect, useMemo, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
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
const TRACK_HEIGHT = 20;
const HANDLE_WIDTH = 4;
const HANDLE_HEIGHT = 44;
const HANDLE_GAP = 6;
const TRACK_INSET = 18; // half a bar, so the end bars and stops line up with the edges
const STOP_SIZE = 4;
const GRAPH_HEIGHT = 110;
const GRAPH_GAP = 12;
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
    <Pressable onPress={onPress} hitSlop={6} style={[styles.barSlot, { left: left - BAR_WIDTH / 2 }]}>
      <Animated.View style={[styles.bar, barStyle]} />
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
      <View style={styles.graph}>
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
        style={styles.hitArea}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <Animated.View pointerEvents="none" style={[styles.track, styles.active, activeStyle]} />
        <Animated.View
          pointerEvents="none"
          style={[styles.track, styles.inactive, inactiveStyle]}
        />

        {levels.map((level, index) => {
          if (level.value === value) return null;
          return (
            <View
              key={level.value}
              pointerEvents="none"
              style={[
                styles.stop,
                {
                  left: stopX(index) - STOP_SIZE / 2,
                  backgroundColor:
                    level.value < value ? colors.brand.featherGreenLight : colors.brand.featherGreen,
                },
              ]}
            />
          );
        })}

        <Animated.View pointerEvents="none" style={[styles.handle, handleStyle]} />
      </View>

      <View className="flex-row justify-between mt-1">
        <Text className="font-manrope-bold text-caption text-text-2">Brand new</Text>
        <Text className="font-manrope-bold text-caption text-text-2">Fluent</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  graph: {
    height: GRAPH_HEIGHT + 6,
    marginBottom: GRAPH_GAP,
  },
  barSlot: {
    position: "absolute",
    bottom: 0,
    width: BAR_WIDTH,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 10,
  },
  hitArea: {
    height: HANDLE_HEIGHT,
  },
  track: {
    position: "absolute",
    bottom: (HANDLE_HEIGHT - TRACK_HEIGHT) / 2,
    height: TRACK_HEIGHT,
  },
  active: {
    left: 0,
    backgroundColor: colors.brand.featherGreen,
    borderTopLeftRadius: TRACK_HEIGHT / 2,
    borderBottomLeftRadius: TRACK_HEIGHT / 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  inactive: {
    right: 0,
    backgroundColor: colors.brand.featherGreenLight,
    borderTopRightRadius: TRACK_HEIGHT / 2,
    borderBottomRightRadius: TRACK_HEIGHT / 2,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  stop: {
    position: "absolute",
    bottom: (HANDLE_HEIGHT - STOP_SIZE) / 2,
    width: STOP_SIZE,
    height: STOP_SIZE,
    borderRadius: STOP_SIZE / 2,
  },
  handle: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: HANDLE_WIDTH / 2,
    backgroundColor: colors.brand.featherGreenLip,
  },
});
