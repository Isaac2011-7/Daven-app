import { levels } from "@/data/onboarding";
import { colors } from "@/theme";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/*
 * A big wheel, inspired by Watermelon UI's "Weight Widget".
 * The wheel is wider than the screen, so only its top curve shows: the
 * selected level sits in a fixed green marker, with its neighbours on either
 * side. Drag sideways to turn it: the drag runs on the UI thread, a flick
 * carries momentum across several levels, and the ends stretch like rubber.
 */
const WHEEL_SCALE = 1.5; // wheel diameter relative to the screen width
const STEP_DEG = 30; // angle between two levels on the wheel
const STEP_RAD = (STEP_DEG * Math.PI) / 180;
const BAND = 76; // thickness of the rim the numbers sit on
const TOP_PAD = 8;
const MARKER = 62;
const MINOR_TICKS = 4; // small ticks between two numbers
const READOUT_SPACE = 110; // room under the arc for the level name
const SNAP_SPRING = { damping: 20, stiffness: 120, mass: 0.9 }; // soft glide, tiny settle
const MOMENTUM = 0.18; // seconds of flick velocity projected forward, like an iOS picker
const RUBBER = 0.35; // how much the wheel stretches past the first/last level
const lastIndex = levels.length - 1;

type Props = {
  value: number;
  onChange: (value: number) => void;
};

/** Position a child on the wheel at `angle` degrees (0 = top) and `r` from the centre. */
const polar = (radius: number, r: number, angle: number, size: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    left: radius + r * Math.sin(rad) - size / 2,
    top: radius - r * Math.cos(rad) - size / 2,
    transform: [{ rotate: `${angle}deg` }],
  };
};

type WheelNumberProps = {
  index: number;
  radius: number;
  offset: SharedValue<number>;
};

/** A number on the rim: white and large in the marker, grey beside it, gone further out. */
function WheelNumber({ index, radius, offset }: WheelNumberProps) {
  const textStyle = useAnimatedStyle(() => {
    const distance = Math.abs(index - offset.get());
    return {
      color: interpolateColor(distance, [0, 0.5], ["#FFFFFF", colors.neutral.disabled]),
      opacity: interpolate(distance, [0, 1, 1.6], [1, 1, 0], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(distance, [0, 1], [1.2, 1], Extrapolation.CLAMP) }],
    };
  });

  return (
    <View style={[styles.numberSlot, polar(radius, radius - BAND / 2, index * STEP_DEG, MARKER)]}>
      <Animated.Text style={[styles.number, textStyle]}>{index + 1}</Animated.Text>
    </View>
  );
}

export function LevelDial({ value, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const diameter = width * WHEEL_SCALE;
  const radius = diameter / 2;
  const wheelLeft = (width - diameter) / 2;
  // How far the rim drops by the time it reaches the screen edges.
  const edgeDrop = radius - Math.sqrt(Math.max(radius * radius - (width / 2) ** 2, 0));
  const height = TOP_PAD + edgeDrop + BAND + READOUT_SPACE;

  const offset = useSharedValue(value - 1); // wheel position, in levels
  const startOffset = useSharedValue(0);
  const dragging = useSharedValue(false);
  const reported = useSharedValue(value); // last level sent to onChange
  const current = levels[value - 1];

  // Turn to the level when it changes from outside a drag (and on first render).
  useEffect(() => {
    reported.set(value);
    if (!dragging.get()) {
      offset.set(withSpring(value - 1, SNAP_SPRING));
    }
  }, [value, offset, dragging, reported]);

  // Dragging one step's worth of arc length turns the wheel one level.
  const pxPerStep = Math.max((radius - BAND / 2) * STEP_RAD, 1);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          dragging.set(true);
          startOffset.set(offset.get());
        })
        .onUpdate((event) => {
          const raw = startOffset.get() - event.translationX / pxPerStep;
          // Past either end, move at a fraction of the finger's speed (rubber band).
          const next =
            raw < 0 ? raw * RUBBER : raw > lastIndex ? lastIndex + (raw - lastIndex) * RUBBER : raw;
          offset.set(next);

          const level = Math.min(Math.max(Math.round(next), 0), lastIndex) + 1;
          if (level !== reported.get()) {
            reported.set(level);
            scheduleOnRN(onChange, level);
          }
        })
        .onFinalize((event) => {
          dragging.set(false);
          // Project the flick forward, then settle on the nearest level,
          // carrying the finger's speed into the spring so there's no jolt.
          const velocity = -event.velocityX / pxPerStep;
          const projected = offset.get() + velocity * MOMENTUM;
          const target = Math.min(Math.max(Math.round(projected), 0), lastIndex);
          offset.set(withSpring(target, { ...SNAP_SPRING, velocity }));

          if (target + 1 !== reported.get()) {
            reported.set(target + 1);
            scheduleOnRN(onChange, target + 1);
          }
        }),
    [pxPerStep, offset, startOffset, dragging, reported, onChange],
  );

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-offset.get() * STEP_DEG}deg` }],
  }));

  const minorTicks = [];
  for (let i = 0; i < lastIndex * (MINOR_TICKS + 1); i++) {
    if (i % (MINOR_TICKS + 1) === 0) continue;
    minorTicks.push((i * STEP_DEG) / (MINOR_TICKS + 1));
  }

  return (
    <GestureDetector gesture={pan}>
      <View
        style={[styles.container, { height }]}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {width > 0 && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {/* Static rim */}
            <View
              style={[
                styles.rim,
                { width: diameter, height: diameter, borderRadius: radius, left: wheelLeft },
              ]}
            />

            {/* Fixed marker at the top of the rim */}
            <View
              style={[
                styles.marker,
                { left: width / 2 - MARKER / 2, top: TOP_PAD + (BAND - MARKER) / 2 },
              ]}
            />

            {/* Turning wheel: numbers and ticks */}
            <Animated.View
              style={[
                styles.wheel,
                { width: diameter, height: diameter, left: wheelLeft },
                wheelStyle,
              ]}
            >
              {minorTicks.map((angle) => (
                <View
                  key={angle}
                  style={[styles.minorTick, polar(radius, radius - BAND - 10, angle, 0)]}
                />
              ))}
              {levels.map((level, index) => (
                <View
                  key={`major-${level.value}`}
                  style={[styles.majorTick, polar(radius, radius - BAND - 12, index * STEP_DEG, 0)]}
                />
              ))}
              {levels.map((level, index) => (
                <WheelNumber key={level.value} index={index} radius={radius} offset={offset} />
              ))}
            </Animated.View>

            {/* Level name, under the arc */}
            <View style={styles.readout}>
              <Animated.View
                key={value}
                entering={FadeIn.duration(180)}
                exiting={FadeOut.duration(120)}
                style={styles.readoutInner}
              >
                <Text className="font-manrope-extrabold text-label tracking-label text-feather-green">
                  LEVEL {current.value} OF {levels.length}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  className="font-manrope-extrabold text-display text-headings mt-2"
                >
                  {current.title}
                </Text>
              </Animated.View>
            </View>
          </View>
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  rim: {
    position: "absolute",
    top: TOP_PAD,
    borderWidth: BAND,
    borderColor: colors.brand.featherGreenLight,
  },
  marker: {
    position: "absolute",
    width: MARKER,
    height: MARKER,
    borderRadius: MARKER / 2,
    backgroundColor: colors.brand.featherGreen,
    boxShadow: `0px 4px 0px 0px ${colors.brand.featherGreenLip}`,
  },
  wheel: {
    position: "absolute",
    top: TOP_PAD,
  },
  numberSlot: {
    position: "absolute",
    width: MARKER,
    height: MARKER,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 30,
  },
  minorTick: {
    position: "absolute",
    width: 2,
    height: 8,
    marginLeft: -1,
    marginTop: -4,
    borderRadius: 1,
    backgroundColor: colors.neutral.border,
  },
  majorTick: {
    position: "absolute",
    width: 3,
    height: 14,
    marginLeft: -1.5,
    marginTop: -7,
    borderRadius: 2,
    backgroundColor: colors.neutral.disabled,
  },
  readout: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 8,
    alignItems: "center",
  },
  readoutInner: {
    alignItems: "center",
  },
});
