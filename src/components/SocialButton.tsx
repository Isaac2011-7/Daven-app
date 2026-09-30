import { Text, TouchableOpacity, View } from "react-native";

type SocialButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  compact?: boolean;
};

/** "Continue with X" pill button — icon pinned left, label centered. */
export function SocialButton({ label, icon, onPress, compact }: SocialButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`relative rounded-2xl border border-border bg-white items-center justify-center ${
        compact ? "py-3" : "py-4"
      }`}
    >
      <View className="absolute left-5 w-9 h-9 rounded-full bg-neutral-100 items-center justify-center">
        {icon}
      </View>
      <Text className="font-manrope-bold text-body-lg text-headings">{label}</Text>
    </TouchableOpacity>
  );
}
