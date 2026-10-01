import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  error?: string;
  onClose: () => void;
  onComplete: (code: string) => void;
};

/**
 * Bottom-sheet modal for entering the 6-digit email verification code.
 * A single hidden TextInput drives the digit boxes so we get the numeric
 * keypad and native paste support without juggling focus across 6 inputs.
 */
export function VerificationModal({
  visible,
  email,
  error,
  onClose,
  onComplete,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const handleChangeText = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) {
      setCode("");
      onComplete(digits);
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={{ flex: 1 }}>
        <Pressable style={StyleSheet.absoluteFill} className="bg-black/40" onPress={handleClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "flex-end" }}
          pointerEvents="box-none"
        >
          <View className="bg-white rounded-t-3xl px-6 pt-4">
            <View className="flex-row justify-end">
              <TouchableOpacity onPress={handleClose} hitSlop={8} className="p-2">
                <Ionicons name="close" size={24} color={colors.neutral.text2} />
              </TouchableOpacity>
            </View>

            <Text className="font-unbounded text-h1 text-headings text-center mt-2">
              Check your email
            </Text>
            <Text className="font-manrope-bold text-body-lg text-text-2 text-center mt-3 px-4">
              We sent a 6-digit code to{"\n"}
              <Text className="text-headings">{email}</Text>
            </Text>

            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="flex-row justify-center gap-3 mt-8"
            >
              {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <View
                  key={index}
                  className={`w-12 h-14 rounded-2xl border items-center justify-center ${
                    index === code.length ? "border-macaw-blue" : "border-border"
                  }`}
                >
                  <Text className="font-unbounded text-h1 text-headings">{code[index] ?? ""}</Text>
                </View>
              ))}
            </Pressable>

            {error ? (
              <Text className="font-manrope-bold text-caption text-error text-center mt-4">{error}</Text>
            ) : null}

            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleChangeText}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              autoFocus
              style={styles.hiddenInput}
            />

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
});
