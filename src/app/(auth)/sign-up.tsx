import { AuthTextField } from "@/components/AuthTextField";
import { SocialButton } from "@/components/SocialButton";
import { VerificationModal } from "@/components/VerificationModal";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { colors } from "@/theme";
import { useSignUp, useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const { signUp } = useSignUp();
  const { isSignedIn } = useAuth();
  const isCompact = useIsCompactScreen();
  const { signInWith, socialError } = useSocialAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    const { error: createError } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });
    if (createError) {
      setError(createError.longMessage ?? createError.message);
      return;
    }
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.longMessage ?? sendError.message);
      return;
    }
    setIsVerifying(true);
  };

  const handleVerified = async (code: string) => {
    setIsVerifying(false);
    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyError) {
      setError(verifyError.longMessage ?? verifyError.message);
      return;
    }
    if (signUp.status !== "complete") {
      setError(
        `Sign-up is not complete (${signUp.status}). Missing: ${signUp.missingFields.join(", ") || "none"}. Unverified: ${signUp.unverifiedFields.join(", ") || "none"}.`,
      );
      return;
    }
    const { error: finalizeError } = await signUp.finalize();
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
            hitSlop={8}
            className={`self-start ${isCompact ? "py-2" : "py-4"}`}
          >
            <Ionicons name="chevron-back" size={28} color={colors.neutral.headings} />
          </TouchableOpacity>

          <Text className="font-unbounded text-h1 text-headings mt-2">Create your account</Text>
          <Text className={`font-manrope-bold text-body-lg text-text-2 ${isCompact ? "mt-1" : "mt-3"}`}>
            Save your streak and keep learning to daven.
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
            <AuthTextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              autoCapitalize="none"
              autoComplete="password"
              isPassword
              compact={isCompact}
            />
          </View>

          {error || socialError ? (
            <Text className="font-manrope-bold text-caption text-error mt-3">{error || socialError}</Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignUp}
            className={`bg-feather-green btn-lip-green rounded-2xl items-center ${
              isCompact ? "py-3 mt-4" : "py-4 mt-6"
            }`}
          >
            <Text className="font-manrope-extrabold text-label tracking-label text-white">SIGN UP</Text>
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
              icon={<Ionicons name="lock-closed-outline" size={18} color={colors.neutral.headings} />}
              onPress={() => signInWith("oauth_apple")}
              compact={isCompact}
            />
          </View>

          <View className="flex-1" />

          <View className={`flex-row justify-center ${isCompact ? "mb-2" : "mb-4"}`}>
            <Text className="font-manrope-bold text-body text-text-2">Already have an account? </Text>
            <Link href="/sign-in" replace asChild>
              <TouchableOpacity hitSlop={8}>
                <Text className="font-manrope-bold text-body text-macaw-blue">Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>

      <VerificationModal
        visible={isVerifying}
        email={email}
        onClose={() => setIsVerifying(false)}
        onComplete={handleVerified}
      />
    </SafeAreaView>
  );
}
