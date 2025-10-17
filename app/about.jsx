import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme"; // adjust path if needed

export default function About() {
  const router = useRouter();
  const { isDarkMode, themeStyles } = useTheme();

  const bgColor = themeStyles?.container?.backgroundColor || (isDarkMode ? "#000" : "#fff");
  const textColor = themeStyles?.text?.color || (isDarkMode ? "#fff" : "#000");
  const secondaryBg = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: secondaryBg, borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>About</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.appName, { color: textColor }]}>Bucket List</Text>
        <Text style={[styles.version, { color: textColor }]}>Version 1.15</Text>

        <Text style={[styles.description, { color: textColor }]}>
          Welcome to <Text style={styles.bold}>Bucket List</Text>, your ultimate companion for turning dreams into
          achievable goals. Whether it’s traveling to breathtaking places, learning new skills, or reaching personal
          milestones, Bucket List helps you organize, track, and celebrate every step of your journey. Designed with
          simplicity and motivation in mind, this app lets you create custom goals, set priorities, and check off
          accomplishments as you grow.
          {"\n\n"}
          Since its first release, Bucket List has evolved through 15 updates — improving performance, refining the
          interface, and adding exciting new features inspired by users like you. Each version brings smoother
          experiences and smarter ways to stay inspired.
          {"\n\n"}
          Your goals matter, and Bucket List is here to make sure they never fade away. Dream it. Plan it. Do it — one
          checkmark at a time.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 20,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.7,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "700",
  },
});
