import { colors } from "@/theme";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const brandSwatches = [
  { name: "Feather Green", bgClass: "bg-feather-green", hex: colors.brand.featherGreen },
  { name: "Macaw Blue", bgClass: "bg-macaw-blue", hex: colors.brand.macawBlue },
  { name: "Fox Orange", bgClass: "bg-fox-orange", hex: colors.brand.foxOrange },
  { name: "Bee Yellow", bgClass: "bg-bee-yellow", hex: colors.brand.beeYellow },
];

const semanticSwatches = [
  { name: "Success", bgClass: "bg-success", hex: colors.semantic.success },
  { name: "Close", bgClass: "bg-close", hex: colors.semantic.close },
  { name: "Streak", bgClass: "bg-streak", hex: colors.semantic.streak },
  { name: "Error", bgClass: "bg-error", hex: colors.semantic.error },
  { name: "Listening", bgClass: "bg-listening", hex: colors.semantic.listening },
];

const lipButtons = [
  { name: "Feather Green", bg: "bg-feather-green", lip: "btn-lip-green" },
  { name: "Macaw Blue", bg: "bg-macaw-blue", lip: "btn-lip-blue" },
  { name: "Fox Orange", bg: "bg-fox-orange", lip: "btn-lip-orange" },
  { name: "Bee Yellow", bg: "bg-bee-yellow", lip: "btn-lip-yellow" },
];

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text className="font-unbounded text-display text-feather-green">DAVEN</Text>
        <Text className="font-manrope-extrabold text-label tracking-label text-text-2 mt-1">
          DESIGN SYSTEM
        </Text>

        <Text className="font-manrope-extrabold text-label tracking-label text-text-2 mt-8">
          COLORS
        </Text>
        <View className="flex-row flex-wrap gap-3 mt-3">
          {brandSwatches.map((swatch) => (
            <View key={swatch.name} className="w-[47%] rounded-2xl border border-border p-3">
              <View className={`h-16 rounded-xl ${swatch.bgClass}`} />
              <Text className="font-manrope-bold text-body text-headings mt-2">{swatch.name}</Text>
              <Text className="font-manrope text-caption text-text-2">{swatch.hex}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row flex-wrap gap-3 mt-3">
          {semanticSwatches.map((swatch) => (
            <View key={swatch.name} className="w-[30%] rounded-2xl border border-border p-2">
              <View className={`h-10 rounded-lg ${swatch.bgClass}`} />
              <Text className="font-manrope-semibold text-caption text-headings mt-1">
                {swatch.name}
              </Text>
            </View>
          ))}
        </View>

        <Text className="font-manrope-extrabold text-label tracking-label text-text-2 mt-8">
          TYPOGRAPHY
        </Text>
        <View className="gap-4 mt-3">
          <Text className="font-unbounded text-display text-headings">Display</Text>
          <Text className="font-unbounded text-h1 text-headings">H1 Screen title</Text>
          <Text className="font-unbounded text-stat text-headings">82%</Text>
          <Text className="font-heebo text-hebrew text-headings text-center">שְׁמַע</Text>
          <Text className="font-manrope-bold text-body-lg text-text">Shema Yisrael</Text>
          <Text className="font-manrope-semibold text-body text-text">
            Hear, O Israel: the Lord is our God, the Lord is One.
          </Text>
          <Text className="font-manrope-semibold text-caption text-text-2">
            Said twice daily, morning and evening
          </Text>
        </View>

        <Text className="font-manrope-extrabold text-label tracking-label text-text-2 mt-8">
          BUTTONS · 3D LIP
        </Text>
        <View className="gap-4 mt-3">
          {lipButtons.map((button) => (
            <TouchableOpacity
              key={button.name}
              activeOpacity={0.85}
              className={`${button.bg} ${button.lip} rounded-2xl py-4 items-center`}
            >
              <Text className="font-manrope-extrabold text-label tracking-label text-white">
                {button.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
});
