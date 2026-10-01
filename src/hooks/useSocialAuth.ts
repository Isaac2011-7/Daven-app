import { useSSO } from "@clerk/expo/experimental";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

WebBrowser.maybeCompleteAuthSession();

export type SocialProvider = "oauth_google" | "oauth_facebook" | "oauth_apple";

/** Starts a Clerk social sign-in and sends the user home when it succeeds. */
export function useSocialAuth() {
  const { startSSOFlow } = useSSO();
  const [socialError, setSocialError] = useState("");

  const signInWith = async (strategy: SocialProvider) => {
    setSocialError("");
    try {
      const { createdSessionId, authSessionResult, signIn, signUp } = await startSSOFlow({
        strategy,
      });

      // startSSOFlow already activates the new (or existing) session before returning.
      if (createdSessionId || signIn?.existingSession || signUp?.existingSession) {
        router.replace("/");
        return;
      }

      if (!authSessionResult) {
        setSocialError("Could not sign in. Try again.");
        return;
      }

      // The user closed the browser before finishing, so there is nothing to report.
      if (authSessionResult.type !== "success") return;

      // The provider signed them in, but Clerk still needs a step this app can't collect yet.
      if (signUp?.status === "missing_requirements") {
        const missing = signUp.missingFields.join(", ") || "more details";
        setSocialError(
          `We couldn't finish creating your account (missing: ${missing}). Sign up with your email instead.`,
        );
      } else {
        setSocialError("This account needs another sign-in step. Log in with your email instead.");
      }
    } catch (err) {
      setSocialError(err instanceof Error ? err.message : "Could not sign in. Try again.");
    }
  };

  return { signInWith, socialError };
}
