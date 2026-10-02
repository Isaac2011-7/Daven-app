import { colors } from "@/theme";
import { useAuth } from "@clerk/expo";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-unbounded text-h1 text-headings">Profile</Text>

        <TouchableOpacity onPress={() => signOut()} hitSlop={8} className="mt-8">
          <Text className="font-manrope-bold text-body text-macaw-blue">Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
