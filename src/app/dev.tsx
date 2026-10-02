import { languages } from "@/data/languages";
import { levels, reasonOptions, startPaths } from "@/data/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuth } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";

/**
 * Development only: open /dev to skip onboarding (and sign-in). Fills in
 * default answers and jumps to Home.
 */
export default function Dev() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!__DEV__ || !isLoaded) {
      return;
    }
    // Signed-in answers are synced to Convex, so only fill them in for guests.
    // Otherwise opening /dev would overwrite the account's real answers.
    if (!isSignedIn) {
      // Built from the onboarding data so every id matches a real option.
      const level = levels[2];
      useOnboardingStore.getState().restore({
        language: languages[0].id,
        level: level.value,
        hebrewReading: level.suggestedHebrew,
        reasons: [reasonOptions[0].id],
        startPath: startPaths[0].id,
        completed: true,
      });
    }
    router.replace("/");
  }, [isLoaded, isSignedIn]);

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return null;
}
