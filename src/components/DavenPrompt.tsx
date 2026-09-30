import { Text, View } from "react-native";

const waveformBars = ["h-3", "h-6", "h-5", "h-7"];

type Props = {
  question: string;
  hint?: string;
};

/** The waveform mascot with a speech bubble asking the onboarding question. */
export function DavenPrompt({ question, hint }: Props) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-16 h-16 rounded-2xl bg-feather-green btn-lip-green items-center justify-center">
        <View className="flex-row items-center gap-[3px]">
          {waveformBars.map((heightClass, index) => (
            <View key={index} className={`w-[4px] ${heightClass} rounded-full bg-white`} />
          ))}
        </View>
      </View>
      <View className="flex-1 option-card px-5 py-4">
        <Text className="font-manrope-extrabold text-body-lg text-text">
          {question}
          {hint ? <Text className="font-manrope-bold text-text-2"> {hint}</Text> : null}
        </Text>
      </View>
    </View>
  );
}
