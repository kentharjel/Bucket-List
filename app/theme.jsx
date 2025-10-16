import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";

export default function ThemeScreen() {
  const { isDarkMode, toggleTheme, themeStyles } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeStyles.container.backgroundColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color={themeStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, themeStyles.text]}>Theme Setting</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Theme Card */}
      <View style={[styles.card, themeStyles.card]}>
        <View style={styles.iconTextRow}>
          <Ionicons
            name={isDarkMode ? "moon" : "sunny"}
            size={28}
            color={isDarkMode ? "#fff" : "#FFA500"}
            style={{ marginRight: 12 }}
          />
          <Text style={[styles.title, themeStyles.text]}>
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </Text>
        </View>

        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? "#fff" : "#000"}
          trackColor={{ false: "#ccc", true: "#4da6ff" }}
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "600", textAlign: "center" },
  card: {
    margin: 20,
    padding: 30,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: "600" },
  iconTextRow: { flexDirection: "row", alignItems: "center" },
});
