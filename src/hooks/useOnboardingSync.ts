import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { startTransition, useEffect, useRef, useState } from "react";
import { useOnboardingStore, type OnboardingAnswers } from "@/store/onboardingStore";

function getCurrentAnswers(): OnboardingAnswers {
  const { language, level, hebrewReading, reasons, startPath, completed } =
    useOnboardingStore.getState();
  return { language, level, hebrewReading, reasons, startPath, completed };
}

export function useOnboardingSync() {
  const { isLoaded, user } = useUser();
  const userId = user?.id;
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();
  const onboarding = useQuery(
    api.users.getOnboarding,
    isLoaded && userId && !convexLoading && isAuthenticated ? {} : "skip",
  );
  const saveOnboarding = useMutation(api.users.saveOnboarding);
  const [ready, setReady] = useState(false);
  const activeUserId = useRef<string | null>(null);
  const loadedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!userId) {
      activeUserId.current = null;
      loadedUserId.current = null;
      useOnboardingStore.getState().reset();
      startTransition(() => setReady(true));
      return;
    }

    if (activeUserId.current !== userId) {
      if (activeUserId.current !== null) {
        useOnboardingStore.getState().reset();
      }
      activeUserId.current = userId;
      loadedUserId.current = null;
      startTransition(() => setReady(false));
    }

    if (convexLoading) {
      return;
    }

    // Clerk can have a user while Convex is still (re)authenticating. Stay
    // blocked until their saved answers load, so nothing overwrites them.
    // If they already loaded, keep the app up; saving resumes after re-auth.
    if (!isAuthenticated) {
      startTransition(() => setReady(loadedUserId.current === userId));
      return;
    }

    if (!onboarding || onboarding.userId !== userId) {
      return;
    }

    if (loadedUserId.current === userId) {
      startTransition(() => setReady(true));
      return;
    }

    if (onboarding.answers) {
      useOnboardingStore.getState().restore(onboarding.answers);
    } else {
      void saveOnboarding(getCurrentAnswers()).catch((error: unknown) => {
        console.error("Could not save onboarding answers.", error);
      });
    }

    loadedUserId.current = userId;
    startTransition(() => setReady(true));
  }, [isLoaded, userId, convexLoading, isAuthenticated, onboarding, saveOnboarding]);

  useEffect(() => {
    if (!ready || !userId || !isAuthenticated) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = useOnboardingStore.subscribe(() => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        void saveOnboarding(getCurrentAnswers()).catch((error: unknown) => {
          console.error("Could not save onboarding answers.", error);
        });
      }, 150);
    });

    return () => {
      unsubscribe();
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [ready, userId, isAuthenticated, saveOnboarding]);

  return ready;
}