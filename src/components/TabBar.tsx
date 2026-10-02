import { colors } from "@/theme";
import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/tabs";
import { type ComponentProps, useEffect, useState } from "react";
import { type LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

/** Icon for each tab, keyed by the route file name in app/(tabs). */
const tabIcons: Record<string, FeatherIconName> = {
  index: "home",
  learn: "book",
  "ai-teacher": "mic",
  chat: "message-circle",
  profile: "user",
};

// Must match the w-[58px] class on the indicator below.
const INDICATOR_WIDTH = 58;

/** Custom bottom tab bar with a highlight that slides to the active tab. */
export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  const getIndicatorX = (index: number, width: number) =>
    index * width + (width - INDICATOR_WIDTH) / 2;

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width / state.routes.length;
    // Jump straight to the first position so the indicator doesn't slide in on mount.
    indicatorX.set(getIndicatorX(state.index, width));
    setTabWidth(width);
  };

  useEffect(() => {
    if (tabWidth === 0) {
      return;
    }
    indicatorX.set(withSpring(getIndicatorX(state.index, tabWidth), { damping: 18, stiffness: 180 }));
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.get() }],
  }));

  return (
    <View className="bg-background" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <View className="mx-2.5 px-3 pt-2.5 border-t-2 border-border">
        <View className="flex-row" onLayout={handleLayout}>
          {tabWidth > 0 && (
            <Animated.View
              className="absolute top-0 left-0 w-[58px] h-[46px] rounded-2xl border-2 border-macaw-blue-border bg-macaw-blue-light"
              style={indicatorStyle}
            />
          )}

          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const title = descriptors[route.key].options.title ?? route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityLabel={title}
                accessibilityState={{ selected: isFocused }}
                className="flex-1 h-[46px] items-center justify-center"
              >
                <Feather
                  name={tabIcons[route.name] ?? "circle"}
                  size={24}
                  color={isFocused ? colors.brand.macawBlue : colors.neutral.disabled}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
