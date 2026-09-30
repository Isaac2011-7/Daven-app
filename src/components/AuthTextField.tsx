import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

type AuthTextFieldProps = Omit<TextInputProps, "className" | "style"> & {
  label: string;
  isPassword?: boolean;
  compact?: boolean;
};

/**
 * Boxed, always-visible-label input used across the auth screens
 * (e.g. `Email`, `Password`) — matches the Sign Up / Sign In design.
 */
export function AuthTextField({ label, isPassword, compact, ...inputProps }: AuthTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View
      className={`rounded-2xl border px-5 ${compact ? "py-2" : "py-3"} ${
        isFocused ? "border-macaw-blue" : "border-border"
      }`}
    >
      <Text className="font-manrope-bold text-caption text-text-2">{label}</Text>
      <View className="flex-row items-center">
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.neutral.disabled}
          underlineColorAndroid="transparent"
          className="flex-1 font-manrope-bold text-body-lg text-headings py-1"
        />
        {isPassword ? (
          <TouchableOpacity
            accessibilityLabel={isSecure ? "Show password" : "Hide password"}
            onPress={() => setIsSecure((prev) => !prev)}
            hitSlop={8}
          >
            <Ionicons
              name={isSecure ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={colors.neutral.text2}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
