// app/tabs/profile.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { accountContext } from "../../contexts/accountContext";
import { useTheme } from "../../hooks/useTheme";

export default function Profile() {
  const { currentUser, logout, updateAvatar, removeAvatar } = useContext(accountContext);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { isDarkMode, themeStyles } = useTheme();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleAccountSettings = () => router.push("../accountSet");
  const handleThemeSettings = () => router.push("../theme");
  const handleAbout = () => router.push("../about");
  const handleDone = () => router.push('../done')

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
  const doneTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const bgColor = themeStyles?.container?.backgroundColor || (isDarkMode ? "#000" : "#fff");
  const textColor = themeStyles?.text?.color || (isDarkMode ? "#fff" : "#000");
  const secondaryBg = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const iconColors = { settings: "#00b4d8", theme: "#f9c74f", about: "#888" };
  const logoutBg = "#d9534f";

  const avatars = [
    "https://a.storyblok.com/f/178900/200x201/1a5e6db121/3614810e9ada5235038e8deb4adc264c1447729591_large.jpg",
    "https://i.pinimg.com/474x/a1/fe/0e/a1fe0e555897cba0069f16b1b22336fe.jpg",
    "https://preview.redd.it/anyone-know-any-ps4-avatars-that-look-like-kaneki-even-in-v0-ap0kinkc72991.jpg?width=500&format=pjpg&auto=webp&s=96eceb7796e263af8e9a7cd90c343a0821a8a670",
    "https://static.wikia.nocookie.net/naruto/images/d/dc/Naruto%27s_Sage_Mode.png/revision/latest/scale-to-width-down/985?cb=20150124180545",
    "https://avatarfiles.alphacoders.com/118/thumb-1920-118702.jpg",
    "https://avatarfiles.alphacoders.com/124/124105.png",
    "https://i.pinimg.com/originals/b1/9c/08/b19c08dc99d1a53ae90d1e3b84e2a000.jpg",
    "https://i.pinimg.com/736x/96/91/28/9691288a3fadba6a8e6173d4eea20488.jpg",
  ];

  // 🔹 Handle Avatar Selection + Save to Firestore
  const handleAvatarSelect = async (url) => {
    try {
      await updateAvatar(url);
      setAvatarModalVisible(false);
      Alert.alert("Avatar Updated", "Your avatar has been changed successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update avatar.");
      console.error(error);
    }
  };

  // 🔹 Long Press to Remove Avatar
  const handleAvatarLongPress = () => {
    if (!currentUser?.avatar) return;
    Alert.alert(
      "Remove Avatar",
      "Do you want to remove your current avatar?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeAvatar();
              Alert.alert("Avatar Removed", "Your avatar has been removed.");
            } catch (error) {
              Alert.alert("Error", "Failed to remove avatar.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.contentWrapper}>
        <View style={[styles.header, { backgroundColor: secondaryBg }]}>
          <Text style={[styles.headerText, { color: textColor }]}>Profile</Text>
        </View>

        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => setAvatarModalVisible(true)}
            onLongPress={handleAvatarLongPress}
            delayLongPress={500}
          >
            {currentUser?.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={150} color={textColor} />
            )}
          </TouchableOpacity>

          <View style={styles.profileDetails}>
            <View style={[styles.usernameBadge, { backgroundColor: secondaryBg, borderColor }]}>
              <Text style={[styles.label, { color: textColor }]}>Username:</Text>
              <Text style={[styles.username, { color: textColor }]}>
                {currentUser?.username || "Guest"}
              </Text>
            </View>

            {/* Settings Toggle */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: secondaryBg, borderColor },
              ]}
              onPress={toggleSettings}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={textColor}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.actionButtonText, { color: textColor }]}>
                  {isSettingsExpanded ? "Close Settings" : "Open Settings"}
                </Text>
                <Ionicons
                  name={isSettingsExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={textColor}
                  style={{ marginLeft: "auto" }}
                />
              </View>
            </TouchableOpacity>

            {/* Animated Settings */}
            <Animated.View
              style={[
                styles.settingsContainer,
                {
                  height: heightInterpolate,
                  opacity: opacityInterpolate,
                  backgroundColor: secondaryBg,
                  borderColor,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.settingsOption}
                onPress={handleAccountSettings}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={iconColors.settings}
                  style={styles.settingsIcon}
                />
                <Text style={[styles.settingsText, { color: textColor }]}>
                  Account Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingsOption}
                onPress={handleThemeSettings}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={iconColors.theme}
                  style={styles.settingsIcon}
                />
                <Text style={[styles.settingsText, { color: textColor }]}>
                  Theme
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingsOption, { borderBottomWidth: 0 }]}
                onPress={handleAbout}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color={iconColors.about}
                  style={styles.settingsIcon}
                />
                <Text style={[styles.settingsText, { color: textColor }]}>
                  About
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Done Button */}
            <Animated.View
              style={{
                transform: [{ translateY: doneTranslate }],
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.doneButton,
                  { backgroundColor: secondaryBg, borderColor },
                ]}
                onPress={handleDone}
              >
                <View style={styles.actionButtonContent}>
                  <Ionicons
                    name="checkmark-done-outline"
                    size={20}
                    color={textColor}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.actionButtonText, { color: textColor }]}>
                    Done List
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: logoutBg }]}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#fff"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar Modal */}
      <Modal
        visible={avatarModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
            {/* Exit Icon */}
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => setAvatarModalVisible(false)}
            >
              <Ionicons name="close-circle" size={28} color="#d9534f" />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: textColor }]}>
              Choose Your Avatar
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.avatarScroll}
            >
              {avatars.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAvatarSelect(url)}
                >
                  <Image
                    source={{ uri: url }}
                    style={[
                      styles.avatarChoice,
                      currentUser?.avatar === url && styles.avatarSelected,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  contentWrapper: { flex: 1, justifyContent: "flex-start" },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: { fontSize: 24, fontWeight: "bold" },
  profileContainer: { alignItems: "center", padding: 20, marginTop: 40 },
  profileDetails: { marginTop: 20, alignItems: "center", width: "100%" },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#888",
  },
  usernameBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  label: { fontSize: 16, fontWeight: "600", marginRight: 8 },
  username: { fontSize: 22, fontWeight: "700" },
  actionButton: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  actionButtonText: { fontSize: 16, fontWeight: "600" },
  settingsContainer: {
    overflow: "hidden",
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 5,
  },
  settingsOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    width: "100%",
  },
  settingsIcon: { marginRight: 10 },
  settingsText: { fontSize: 16, fontWeight: "600" },
  bottomSection: { paddingBottom: 30, alignItems: "center" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  logoutIcon: { marginRight: 8 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  exitButton: { alignSelf: "flex-end" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  avatarScroll: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  avatarChoice: { width: 90, height: 90, borderRadius: 45, marginHorizontal: 6 },
  avatarSelected: { borderWidth: 3, borderColor: "#00b4d8" },
});
