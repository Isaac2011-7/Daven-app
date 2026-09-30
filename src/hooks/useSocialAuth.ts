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
      const { createdSessionId } = await startSSOFlow({ strategy });
      if (createdSessionId) {
        router.replace("/");
      }
    } catch (err) {
      setSocialError(err instanceof Error ? err.message : "Could not sign in. Try again.");
    }
  };

  return { signInWith, socialError };
}
