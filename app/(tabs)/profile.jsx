import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { accountContext } from "../../contexts/accountContext";
import { useTheme } from "../../hooks/useTheme";

export default function Profile() {
  const { currentUser, logout } = useContext(accountContext);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { isDarkMode, themeStyles } = useTheme();

  const handleLogout = () => {
    logout();
    router.replace("/"); // back to login/home
  };

  const handleAccountSettings = () => router.push("../accountSet");
  const handleThemeSettings = () => router.push("../theme");
  const handleAbout = () => Alert.alert("About", "About Screen Navigation");
  const handleDone = () => Alert.alert("Done", "This will navigate to Done screen");

  const toggleSettings = () => {
    const toValue = isSettingsExpanded ? 0 : 1;
    setIsSettingsExpanded(!isSettingsExpanded);
    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolate = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 140] });
  const opacityInterpolate = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const doneTranslate = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });

  // Theme colors
  const bgColor = themeStyles?.container?.backgroundColor || (isDarkMode ? "#000" : "#fff");
  const textColor = themeStyles?.text?.color || (isDarkMode ? "#fff" : "#000");
  const secondaryBg = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const iconColors = { settings: "#00b4d8", theme: "#f9c74f", about: "#888" };
  const logoutBg = isDarkMode ? "#d9534f" : "#d9534f";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.contentWrapper}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: secondaryBg }]}>
          <Text style={[styles.headerText, { color: textColor }]}>Profile</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle-outline" size={150} color={textColor} />

          <View style={styles.profileDetails}>
            <View style={[styles.usernameBadge, { backgroundColor: secondaryBg, borderColor }]}>
              <Text style={[styles.label, { color: textColor }]}>Username:</Text>
              <Text style={[styles.username, { color: textColor }]}>
                {currentUser?.username || "Guest"}
              </Text>
            </View>

            {/* Settings Toggle */}
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: secondaryBg, borderColor }]} onPress={toggleSettings}>
              <View style={styles.actionButtonContent}>
                <Ionicons name="settings-outline" size={20} color={textColor} style={{ marginRight: 8 }} />
                <Text style={[styles.actionButtonText, { color: textColor }]}>
                  {isSettingsExpanded ? "Close Settings" : "Open Settings"}
                </Text>
                <Ionicons name={isSettingsExpanded ? "chevron-up" : "chevron-down"} size={20} color={textColor} style={{ marginLeft: "auto" }} />
              </View>
            </TouchableOpacity>

            {/* Animated Settings */}
            <Animated.View style={[styles.settingsContainer, { height: heightInterpolate, opacity: opacityInterpolate, backgroundColor: secondaryBg, borderColor }]}>
              <TouchableOpacity style={styles.settingsOption} onPress={handleAccountSettings}>
                <Ionicons name="person-outline" size={20} color={iconColors.settings} style={styles.settingsIcon} />
                <Text style={[styles.settingsText, { color: textColor }]}>Account Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsOption} onPress={handleThemeSettings}>
                <Ionicons name="color-palette-outline" size={20} color={iconColors.theme} style={styles.settingsIcon} />
                <Text style={[styles.settingsText, { color: textColor }]}>Theme</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingsOption, { borderBottomWidth: 0 }]} onPress={handleAbout}>
                <Ionicons name="alert-circle-outline" size={20} color={iconColors.about} style={styles.settingsIcon} />
                <Text style={[styles.settingsText, { color: textColor }]}>About</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Done Button */}
            <Animated.View style={{ transform: [{ translateY: doneTranslate }], width: "100%" }}>
              <TouchableOpacity style={[styles.actionButton, styles.doneButton, { backgroundColor: secondaryBg, borderColor }]} onPress={handleDone}>
                <View style={styles.actionButtonContent}>
                  <Ionicons name="checkmark-done-outline" size={20} color={textColor} style={{ marginRight: 8 }} />
                  <Text style={[styles.actionButtonText, { color: textColor }]}>Done List</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: logoutBg }]}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  contentWrapper: { flex: 1, justifyContent: "flex-start" },
  header: { paddingVertical: 20, alignItems: "center", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  headerText: { fontSize: 24, fontWeight: "bold" },
  profileContainer: { alignItems: "center", padding: 20, marginTop: 40 },
  profileDetails: { marginTop: 20, alignItems: "center", width: "100%" },
  usernameBadge: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "600", marginRight: 8 },
  username: { fontSize: 22, fontWeight: "700" },
  actionButton: { width: "100%", borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  actionButtonContent: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 18 },
  actionButtonText: { fontSize: 16, fontWeight: "600" },
  doneButton: {},
  settingsContainer: { overflow: "hidden", borderRadius: 14, width: "100%", alignItems: "center", borderWidth: 1, marginBottom: 5 },
  settingsOption: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, width: "100%" },
  settingsIcon: { marginRight: 10 },
  settingsText: { fontSize: 16, fontWeight: "600" },
  bottomSection: { paddingBottom: 30, alignItems: "center" },
  logoutButton: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  logoutIcon: { marginRight: 8 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
