import { Unbounded_800ExtraBold } from "@expo-google-fonts/unbounded";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { Heebo_800ExtraBold } from "@expo-google-fonts/heebo";

/**
 * Font family names, kept in sync with the `--font-*` tokens in global.css.
 * React Native registers one family per loaded weight, so pick the weight
 * you need directly rather than combining a family with `fontWeight`.
 */
export const fontFamily = {
  unbounded: "Unbounded_800ExtraBold",
  manrope: "Manrope_400Regular",
  manropeMedium: "Manrope_500Medium",
  manropeSemiBold: "Manrope_600SemiBold",
  manropeBold: "Manrope_700Bold",
  manropeExtraBold: "Manrope_800ExtraBold",
  heebo: "Heebo_800ExtraBold",
} as const;

/** Passed to `useFonts()` in the root layout to load every weight the app uses. */
export const fontsToLoad = {
  Unbounded_800ExtraBold,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  Heebo_800ExtraBold,
};
