import { fontFamily } from "./fonts";

/**
 * Type scale, kept in sync with the `--text-*` tokens in global.css.
 * Use the NativeWind className (e.g. `text-display font-unbounded`) by
 * default — reach for this object only in the StyleSheet Style Exception
 * cases from AGENTS.md (e.g. Animated.View, dynamic styles).
 */
export const typeScale = {
  display: {
    fontFamily: fontFamily.unbounded,
    fontSize: 38,
    lineHeight: 38,
  },
  h1: {
    fontFamily: fontFamily.unbounded,
    fontSize: 26,
    lineHeight: 27.3,
  },
  stat: {
    fontFamily: fontFamily.unbounded,
    fontSize: 20,
    lineHeight: 20,
  },
  hebrew: {
    fontFamily: fontFamily.heebo,
    fontSize: 34,
    lineHeight: 44.2,
  },
  bodyLarge: {
    fontFamily: fontFamily.manropeBold,
    fontSize: 17,
    lineHeight: 25.5,
  },
  body: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 14,
    lineHeight: 21,
  },
  label: {
    fontFamily: fontFamily.manropeExtraBold,
    fontSize: 12,
    lineHeight: 14.4,
    letterSpacing: 1.4,
  },
  caption: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 12,
    lineHeight: 16.8,
  },
} as const;
