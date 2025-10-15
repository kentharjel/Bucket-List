import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { accountContext } from "../contexts/accountContext";

export default function AccountSettings() {
  const router = useRouter();
  const { currentUser, updateAccount, changePassword, deleteAccount } =
    useContext(accountContext);

  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDeletePassword, setConfirmDeletePassword] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔹 Open modals
  const handleChangeUsername = () => setIsUsernameModalVisible(true);
  const handleChangePassword = () => setIsPasswordModalVisible(true);
  const handleDeleteAccount = () => setIsDeleteModalVisible(true);

  // 🔹 Save username
  const handleSaveUsername = async () => {
    if (!newUsername.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    setLoading(true);
    const result = await updateAccount({
      oldUsername: currentUser,
      newUsername,
      password,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", result.message);
      setIsUsernameModalVisible(false);
      setNewUsername("");
      setPassword("");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  // 🔹 Save password
  const handleSavePassword = async () => {
    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await changePassword({
      username: currentUser,
      currentPassword,
      newPassword,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", result.message);
      setIsPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  // 🔹 Delete account
  const handleConfirmDelete = async () => {
    if (!deletePassword.trim() || !confirmDeletePassword.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (deletePassword !== confirmDeletePassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await deleteAccount({
      username: currentUser,
      password: deletePassword,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", result.message);
      setIsDeleteModalVisible(false);
      router.replace("/"); // go back to login or main screen
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const settingsOptions = [
    { id: "1", title: "Change Username", onPress: handleChangeUsername },
    { id: "2", title: "Change Password", onPress: handleChangePassword },
    {
      id: "3",
      title: "Delete Account",
      onPress: handleDeleteAccount,
      isDanger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Account Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Settings list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.settingsOption, option.isDanger && styles.dangerOption]}
            onPress={option.onPress}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name={
                  option.isDanger
                    ? "alert-circle-outline"
                    : option.id === "1"
                    ? "person-outline"
                    : "lock-closed-outline"
                }
                size={22}
                color={option.isDanger ? "#ff4d4d" : "#fff"}
              />
              <Text style={[styles.settingsText, option.isDanger && styles.dangerText]}>
                {option.title}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={option.isDanger ? "#ff4d4d" : "#aaa"}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔹 Username Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isUsernameModalVisible}
        onRequestClose={() => setIsUsernameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Username</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter new username"
              placeholderTextColor="#aaa"
              value={newUsername}
              onChangeText={setNewUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsUsernameModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveUsername}
                disabled={loading}
              >
                <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔹 Password Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isPasswordModalVisible}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsPasswordModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePassword}
                disabled={loading}
              >
                <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔹 Delete Account Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: "#ff4d4d" }]}>Delete Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={deletePassword}
              onChangeText={setDeletePassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={confirmDeletePassword}
              onChangeText={setConfirmDeletePassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleConfirmDelete}
                disabled={loading}
              >
                <Text style={styles.saveText}>{loading ? "Deleting..." : "Delete"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// same styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  backButton: { padding: 4, borderRadius: 10 },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  scrollContent: { padding: 20 },
  settingsOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  settingsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  dangerOption: {
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    borderColor: "#ff4d4d",
  },
  dangerText: { color: "#ff4d4d" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "#333",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#ff4d4d",
    marginLeft: 8,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});
