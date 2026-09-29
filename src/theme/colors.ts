/**
 * Design-system colors, kept in sync with the `--color-*` tokens in global.css.
 * Prefer NativeWind classNames (e.g. `bg-feather-green`) for styling — reach
 * for this object only where NativeWind can't be used (see the Style
 * Exception Rules in AGENTS.md), e.g. StatusBar, SafeAreaView, native modals.
 */
export const colors = {
  brand: {
    featherGreen: "#58CC02",
    featherGreenLip: "#58A700",
    featherGreenLight: "#E1F6D3",
    macawBlue: "#1CB0F6",
    macawBlueLip: "#1899D6",
    macawBlueLight: "#DDF1FE",
    foxOrange: "#FF9600",
    foxOrangeLip: "#E08400",
    foxOrangeLight: "#FEE7D3",
    beeYellow: "#FFC800",
    beeYellowLip: "#E0A800",
    beeYellowLight: "#FDF0D3",
  },
  semantic: {
    success: "#58CC02",
    close: "#FFC800",
    streak: "#FF9600",
    error: "#FF4B4B",
    listening: "#1CB0F6",
  },
  neutral: {
    headings: "#3C3C3C",
    text: "#4B4B4B",
    text2: "#777777",
    disabled: "#AFAFAF",
    border: "#E5E5E5",
    background: "#FFFFFF",
  },
} as const;
