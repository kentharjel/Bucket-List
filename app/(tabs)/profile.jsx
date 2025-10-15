import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
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
import { useAccount } from "../../hooks/useAccount";

export default function Profile() {
  const { currentUser, logout } = useAccount();
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleAccountSettings = () => {
    router.push('../accountSet')
  };

  const handleThemeSettings = () => {
    Alert.alert("Theme Settings", "Changing theme settings...");
  };

  const handleTAbout = () => {
    Alert.alert("About", "About Screen Navigation");
  };

  // Animate expand/collapse
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

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText} allowFontScaling={false}>
          Profile
        </Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Ionicons
          name="person-circle-outline"
          size={150}
          color="#ffffff"
          accessibilityLabel="Profile icon"
        />

        <View style={styles.profileDetails}>
          <View style={styles.usernameBadge}>
            <Text style={styles.label} allowFontScaling={false}>
              Username:
            </Text>
            <Text style={styles.username} allowFontScaling={false}>
              {currentUser ? String(currentUser) : "Guest"}
            </Text>
          </View>

          {/* Settings Toggle Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={toggleSettings}
            accessibilityLabel="Toggle settings menu"
            accessibilityRole="button"
          >
            <Ionicons
              name="settings-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.settingsButtonText}>
              {isSettingsExpanded ? "Close Settings" : "Open Settings"}
            </Text>
          </TouchableOpacity>

          {/* Animated Expanded Settings Section */}
          <Animated.View
            style={[
              styles.settingsContainer,
              { height: heightInterpolate, opacity: opacityInterpolate },
            ]}
          >
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={handleAccountSettings}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color="#00b4d8"
                style={styles.settingsIcon}
              />
              <Text style={styles.settingsText}>Account Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsOption}
              onPress={handleThemeSettings}
            >
              <Ionicons
                name="color-palette-outline"
                size={20}
                color="#f9c74f"
                style={styles.settingsIcon}
              />
              <Text style={styles.settingsText}>Theme</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingsOption, { borderBottomWidth: 0 }]}
              onPress={handleTAbout}
            >
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#ccc"
                style={styles.settingsIcon}
              />
              <Text style={styles.settingsText}>
                About
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      {/* Logout Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          accessibilityLabel="Log out button"
          accessibilityRole="button"
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#fff"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText} allowFontScaling={false}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  profileDetails: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  usernameBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffffff",
    marginBottom: 15,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  settingsButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffff",
    alignItems: "center",
    marginBottom: 10,
  },
  settingsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  settingsContainer: {
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  settingsOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    width: "100%",
  },
  settingsIcon: {
    marginRight: 10,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bottomSection: {
    paddingBottom: 30,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
