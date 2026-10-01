import { useOnboardingStore } from "@/store/onboardingStore";
import { colors } from "@/theme";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isLoaded, isSignedIn, userId, signOut } = useAuth();
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const onboardingCompleted = useOnboardingStore((state) =>
    userId ? state.completedUserIds.includes(userId) : false,
  );

  if (!isLoaded || !hasHydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/level" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-unbounded text-display text-feather-green text-center">
          Welcome to daven
        </Text>
        <Text className="font-manrope-bold text-body-lg text-text-2 text-center mt-4">
          You&apos;re signed in. The home experience lives here next.
        </Text>

        <TouchableOpacity onPress={() => signOut()} hitSlop={8} className="mt-8">
          <Text className="font-manrope-bold text-body text-macaw-blue">Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
