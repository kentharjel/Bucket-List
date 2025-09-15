import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccount } from "../../hooks/useAccount";

export default function Profile() {
  const { currentUser, logout } = useAccount();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} allowFontScaling={false}>Profile</Text>
      </View>

      <View style={styles.profileRow}>
        <Ionicons name="person-circle-outline" size={175} color="#ffffff"/>
        <View>
          <Text style={styles.label} allowFontScaling={false}>Username:</Text>
          <Text style={styles.username} allowFontScaling={false}>
            @{currentUser ? currentUser : "Guest"}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText} allowFontScaling={false}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 35
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  label:{
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 900
  },
  username: {
    fontSize: 35,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 5,
  },
  bottomSection: {
    paddingBottom: 30,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "70%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
