import { AuthTextField } from "@/components/AuthTextField";
import { SocialButton } from "@/components/SocialButton";
import { VerificationModal } from "@/components/VerificationModal";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { colors } from "@/theme";
import { useSignIn, useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const isCompact = useIsCompactScreen();
  const { signInWith, socialError } = useSocialAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (isSubmitting) return;
    if (!email.trim()) {
      setError("Enter your email to continue.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const { error: sendError } = await signIn.emailCode.sendCode({ emailAddress: email.trim() });
      if (sendError) {
        setError(sendError.longMessage ?? sendError.message);
        return;
      }
      setCodeError("");
      setIsVerifying(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerified = async (code: string) => {
    setCodeError("");
    const { error: verifyError } = await signIn.emailCode.verifyCode({ code });
    if (verifyError) {
      setCodeError(verifyError.longMessage ?? verifyError.message);
      return;
    }
    setIsVerifying(false);
    const { error: finalizeError } = await signIn.finalize();
    if (finalizeError) {
      setError(finalizeError.longMessage ?? finalizeError.message);
      return;
    }
  };

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-8">
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            hitSlop={8}
            className={`self-start ${isCompact ? "py-2" : "py-4"}`}
          >
            <Ionicons name="chevron-back" size={28} color={colors.neutral.headings} />
          </TouchableOpacity>

          <Text className="font-unbounded text-h1 text-headings mt-2">Welcome back</Text>
          <Text className={`font-manrope-bold text-body-lg text-text-2 ${isCompact ? "mt-1" : "mt-3"}`}>
            Log in to keep your streak going.
          </Text>

          <View className={`gap-3 ${isCompact ? "mt-4" : "mt-8"}`}>
            <AuthTextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="isaac@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              compact={isCompact}
            />
          </View>

          {error || socialError ? (
            <Text className="font-manrope-bold text-caption text-error mt-3">{error || socialError}</Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={isSubmitting}
            className={`bg-feather-green btn-lip-green rounded-2xl items-center ${
              isCompact ? "py-3 mt-4" : "py-4 mt-6"
            } ${isSubmitting ? "opacity-60" : ""}`}
          >
            <Text className="font-manrope-extrabold text-label tracking-label text-white">LOG IN</Text>
          </TouchableOpacity>

          <View className={`flex-row items-center gap-3 ${isCompact ? "mt-4" : "mt-8"}`}>
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="font-manrope-bold text-body text-text-2">or continue with</Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          <View className={`gap-2 ${isCompact ? "mt-3" : "mt-6"}`}>
            <SocialButton
              label="Continue with Google"
              icon={<Text className="font-manrope-extrabold text-body-lg text-headings">G</Text>}
              onPress={() => signInWith("oauth_google")}
              compact={isCompact}
            />
            <SocialButton
              label="Continue with Facebook"
              icon={<Text className="font-manrope-extrabold text-body-lg text-headings">f</Text>}
              onPress={() => signInWith("oauth_facebook")}
              compact={isCompact}
            />
            <SocialButton
              label="Continue with Apple"
              icon={<Ionicons name="logo-apple" size={18} color={colors.neutral.headings} />}
              onPress={() => signInWith("oauth_apple")}
              compact={isCompact}
            />
          </View>

          <View className="flex-1" />

          <View className={`flex-row justify-center ${isCompact ? "mb-2" : "mb-4"}`}>
            <Text className="font-manrope-bold text-body text-text-2">Don&apos;t have an account? </Text>
            <Link href="/sign-up" replace asChild>
              <TouchableOpacity hitSlop={8}>
                <Text className="font-manrope-bold text-body text-macaw-blue">Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>

      <VerificationModal
        visible={isVerifying}
        email={email}
        error={codeError}
        onClose={() => {
          setIsVerifying(false);
          setCodeError("");
        }}
        onComplete={handleVerified}
      />
    </SafeAreaView>
  );
}
