import { TabBar } from "@/components/TabBar";
import { useStoreUser } from "@/hooks/useStoreUser";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const onboardingCompleted = useOnboardingStore((state) => state.completed);

  // Saves the signed-in user in Convex.
  useStoreUser();

  if (!isLoaded) {
    return null;
  }

  // In development, let signed-out testers who finished onboarding see Home.
  // Production always requires sign-in.
  const devGuest = __DEV__ && onboardingCompleted;
  if (!isSignedIn && !devGuest) {
    return <Redirect href="/onboarding" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/level" />;
  }

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
