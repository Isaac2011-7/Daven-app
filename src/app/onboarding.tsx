import { colors } from "@/theme";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const letterChips = [
  {
    letter: "א",
    position: "-top-3 -left-3",
    rotate: "-rotate-6",
    bg: "bg-macaw-blue-light",
    text: "text-macaw-blue-lip",
  },
  {
    letter: "ש",
    position: "-top-3 -right-3",
    rotate: "rotate-6",
    bg: "bg-bee-yellow-light",
    text: "text-bee-yellow-lip",
  },
  {
    letter: "ל",
    position: "-bottom-3 -left-3",
    rotate: "rotate-6",
    bg: "bg-feather-green-light",
    text: "text-feather-green-lip",
  },
  {
    letter: "ב",
    position: "-bottom-3 -right-3",
    rotate: "-rotate-6",
    bg: "bg-fox-orange-light",
    text: "text-fox-orange-lip",
  },
];

const waveformBars = ["h-6", "h-10", "h-14", "h-10", "h-6"];

export default function Onboarding() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <View className="flex-1 w-full px-8 items-center">
        <View className="relative w-64 h-64 items-center justify-center self-center mt-16">
          {letterChips.map((chip) => (
            <View
              key={chip.letter}
              className={`absolute ${chip.position} ${chip.rotate} ${chip.bg} w-[72px] h-[72px] rounded-2xl items-center justify-center`}
            >
              <Text className={`font-heebo text-[32px] ${chip.text}`}>{chip.letter}</Text>
            </View>
          ))}

          <View className="w-[136px] h-[136px] rounded-[32px] bg-feather-green btn-lip-green items-center justify-center">
            <View className="flex-row items-center gap-2">
              {waveformBars.map((heightClass, index) => (
                <View key={index} className={`w-[7px] ${heightClass} rounded-full bg-white`} />
              ))}
            </View>
          </View>
        </View>

        <Text className="font-unbounded text-hero text-feather-green mt-10">daven</Text>

        <Text className="font-manrope-bold text-body-lg text-headings text-center mt-4 px-4">
          Learn to pray with confidence, one line at a time.
        </Text>

        <View className="flex-1" />

        <View className="w-full gap-3 mb-4">
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-feather-green btn-lip-green rounded-2xl py-4 items-center"
          >
            <Text className="font-manrope-extrabold text-label tracking-label text-white">
              GET STARTED
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-white border border-border rounded-2xl py-4 items-center"
          >
            <Text className="font-manrope-extrabold text-label tracking-label text-macaw-blue">
              I ALREADY HAVE AN ACCOUNT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
