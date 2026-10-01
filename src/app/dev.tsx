import { useOnboardingStore } from "@/store/onboardingStore";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";

/**
 * Development only: open /dev to skip onboarding (and sign-in). Fills in
 * default answers and jumps to Home.
 */
export default function Dev() {
  useEffect(() => {
    if (!__DEV__) {
      return;
    }
    useOnboardingStore.getState().restore({
      language: "en",
      level: 3,
      hebrewReading: "not-yet",
      reasons: ["daily"],
      startPath: "shema",
      completed: true,
    });
    router.replace("/");
  }, []);

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return null;
}
