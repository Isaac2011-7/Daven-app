import { VariableContextProvider } from "nativewind";
import { View } from "react-native";

// Must match the w-12 / border-[6px] classes below.
const SIZE = 48;
const THICKNESS = 6;

type Props = {
  /** 0 to 1 */
  progress: number;
};

/**
 * 48px blue progress ring made from plain Views (no SVG). The arc is two
 * half-rings, each clipped to one side of the circle and rotated into view,
 * plus a dot at each end for rounded caps. It fills clockwise from 12 o'clock.
 *
 * Runtime values (rotations, end cap position) are passed to the classNames
 * as CSS variables through VariableContextProvider.
 */
export function ProgressRing({ progress }: Props) {
  const value = Math.min(Math.max(progress, 0), 1);
  // The right side fills first (0-50%), then the left side (50-100%).
  const rightRotation = Math.min(value, 0.5) * 360;
  const leftRotation = Math.max(value - 0.5, 0) * 360;

  // The end cap sits on the middle of the stroke at the progress angle.
  const strokeRadius = (SIZE - THICKNESS) / 2;
  const endAngle = value * 2 * Math.PI;
  const capX = SIZE / 2 + strokeRadius * Math.sin(endAngle) - THICKNESS / 2;
  const capY = SIZE / 2 - strokeRadius * Math.cos(endAngle) - THICKNESS / 2;

  return (
    <VariableContextProvider
      value={{
        "--right-rotation": `${rightRotation}deg`,
        "--left-rotation": `${leftRotation}deg`,
        "--cap-x": `${capX}px`,
        "--cap-y": `${capY}px`,
      }}
    >
      <View className="w-12 h-12">
        <View className="absolute inset-0 rounded-full border-[6px] border-border" />

        {/* Right side: a left half-ring rotated into the visible right half. */}
        <View className="absolute top-0 left-6 w-6 h-12 overflow-hidden">
          <View className="absolute top-0 -left-6 w-12 h-12 rotate-(--right-rotation)">
            <View className="absolute top-0 left-0 w-6 h-12 rounded-l-full border-y-[6px] border-l-[6px] border-macaw-blue" />
          </View>
        </View>

        {/* Left side: a right half-ring rotated into the visible left half. */}
        <View className="absolute top-0 left-0 w-6 h-12 overflow-hidden">
          <View className="absolute top-0 left-0 w-12 h-12 rotate-(--left-rotation)">
            <View className="absolute top-0 left-6 w-6 h-12 rounded-r-full border-y-[6px] border-r-[6px] border-macaw-blue" />
          </View>
        </View>

        {value > 0 && (
          <>
            <View className="absolute top-0 left-[21px] w-1.5 h-1.5 rounded-full bg-macaw-blue" />
            <View className="absolute top-(--cap-y) left-(--cap-x) w-1.5 h-1.5 rounded-full bg-macaw-blue" />
          </>
        )}
      </View>
    </VariableContextProvider>
  );
}
