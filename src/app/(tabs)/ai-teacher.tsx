import { colors } from "@/theme";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AiTeacher() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-unbounded text-h1 text-headings">AI Teacher</Text>
      </View>
    </SafeAreaView>
  );
}
