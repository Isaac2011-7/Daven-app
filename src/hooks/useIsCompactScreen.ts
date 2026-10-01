import { useWindowDimensions } from "react-native";

const COMPACT_HEIGHT_BREAKPOINT = 780;

/**
 * True on shorter-screen phones (e.g. iPhone SE/8, small Android devices)
 * where our normal spacing would push content below the fold.
 */
export function useIsCompactScreen() {
  const { height } = useWindowDimensions();
  return height < COMPACT_HEIGHT_BREAKPOINT;
}
