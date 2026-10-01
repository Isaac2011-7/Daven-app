import { levels } from "@/data/onboarding";
import { colors } from "@/theme";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
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
// BAND, TOP_PAD and MARKER are also written as classes below (border-[76px], top-2, w-[62px]/h-[62px]) — keep them in sync.
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
    <View
      className="absolute w-[62px] h-[62px] items-center justify-center"
      style={polar(radius, radius - BAND / 2, index * STEP_DEG, MARKER)}
    >
      <Animated.Text className="font-manrope-extrabold text-[30px]" style={textStyle}>
        {index + 1}
      </Animated.Text>
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
        className="w-full overflow-hidden"
        style={{ height }}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {width > 0 && (
          <View pointerEvents="none" className="absolute inset-0">
            {/* Static rim */}
            <View
              className="absolute top-2 border-[76px] border-feather-green-light"
              style={{ width: diameter, height: diameter, borderRadius: radius, left: wheelLeft }}
            />

            {/* Fixed marker at the top of the rim */}
            <View
              className="absolute w-[62px] h-[62px] rounded-full bg-feather-green btn-lip-green"
              style={{ left: width / 2 - MARKER / 2, top: TOP_PAD + (BAND - MARKER) / 2 }}
            />

            {/* Turning wheel: numbers and ticks */}
            <Animated.View
              className="absolute top-2"
              style={[{ width: diameter, height: diameter, left: wheelLeft }, wheelStyle]}
            >
              {minorTicks.map((angle) => (
                <View
                  key={angle}
                  className="absolute w-0.5 h-2 -ml-px -mt-1 rounded-[1px] bg-border"
                  style={polar(radius, radius - BAND - 10, angle, 0)}
                />
              ))}
              {levels.map((level, index) => (
                <View
                  key={`major-${level.value}`}
                  className="absolute w-[3px] h-3.5 -ml-[1.5px] -mt-[7px] rounded-[2px] bg-disabled"
                  style={polar(radius, radius - BAND - 12, index * STEP_DEG, 0)}
                />
              ))}
              {levels.map((level, index) => (
                <WheelNumber key={level.value} index={index} radius={radius} offset={offset} />
              ))}
            </Animated.View>

            {/* Level name, under the arc */}
            <View className="absolute left-6 right-6 bottom-2 items-center">
              <Animated.View
                key={value}
                entering={FadeIn.duration(180)}
                exiting={FadeOut.duration(120)}
                className="items-center"
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
