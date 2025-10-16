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
import { useTheme } from "../hooks/useTheme";

export default function AccountSettings() {
  const router = useRouter();
  const { currentUser, updateAccount, changePassword, deleteAccount } =
    useContext(accountContext);
  const { isDarkMode } = useTheme();

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

  if (!currentUser) {
    router.replace("/");
    return null;
  }

  // Theme colors
  const bgColor = isDarkMode ? "#000" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";
  const secondaryBg = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
  const dangerColor = "#ff4d4d";

  // Handlers
  const handleChangeUsername = () => setIsUsernameModalVisible(true);
  const handleChangePassword = () => setIsPasswordModalVisible(true);
  const handleDeleteAccount = () => setIsDeleteModalVisible(true);

  const handleSaveUsername = async () => {
    if (!newUsername.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    setLoading(true);
    const result = await updateAccount({
      oldUsername: currentUser.username,
      newUsername,
      password,
    });
    setLoading(false);
    if (result.success) {
      Alert.alert("Success", result.message);
      setIsUsernameModalVisible(false);
      setNewUsername("");
      setPassword("");
    } else Alert.alert("Error", result.message);
  };

  const handleSavePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    setLoading(true);
    const result = await changePassword({
      username: currentUser.username,
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
    } else Alert.alert("Error", result.message);
  };

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
      username: currentUser.username,
      password: deletePassword,
    });
    setLoading(false);
    if (result.success) {
      Alert.alert("Success", result.message);
      setIsDeleteModalVisible(false);
      router.replace("/");
    } else Alert.alert("Error", result.message);
  };

  const settingsOptions = [
    { id: "1", title: "Change Username", onPress: handleChangeUsername },
    { id: "2", title: "Change Password", onPress: handleChangePassword },
    { id: "3", title: "Delete Account", onPress: handleDeleteAccount, isDanger: true },
  ];

  // Modal component
  const renderModal = ({
    visible,
    onClose,
    title,
    inputs,
    onSubmit,
    isDanger = false,
  }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: secondaryBg, borderColor }]}>
          <Text style={[styles.modalTitle, { color: isDanger ? dangerColor : textColor }]}>{title}</Text>

          {inputs.map((input, idx) => (
            <TextInput
              key={idx}
              style={[styles.input, { backgroundColor: secondaryBg, borderColor, color: textColor }]}
              placeholder={input.placeholder}
              placeholderTextColor="#aaa"
              secureTextEntry={input.secure}
              value={input.value}
              onChangeText={input.onChangeText}
            />
          ))}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={onSubmit} disabled={loading}>
              <Text style={styles.saveText}>
                {loading ? (isDanger ? "Deleting..." : "Saving...") : isDanger ? "Delete" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { backgroundColor: secondaryBg, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: textColor }]}>Account Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.settingsOption,
              { backgroundColor: option.isDanger ? "rgba(255,77,77,0.1)" : secondaryBg, borderColor: option.isDanger ? dangerColor : borderColor },
            ]}
            onPress={option.onPress}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name={option.isDanger ? "alert-circle-outline" : option.id === "1" ? "person-outline" : "lock-closed-outline"}
                size={22}
                color={option.isDanger ? dangerColor : textColor}
              />
              <Text style={[styles.settingsText, { color: option.isDanger ? dangerColor : textColor }]}>
                {option.title}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={option.isDanger ? dangerColor : "#aaa"} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modals */}
      {renderModal({
        visible: isUsernameModalVisible,
        onClose: () => setIsUsernameModalVisible(false),
        title: "Change Username",
        inputs: [
          { placeholder: "Enter new username", secure: false, value: newUsername, onChangeText: setNewUsername },
          { placeholder: "Enter password", secure: true, value: password, onChangeText: setPassword },
        ],
        onSubmit: handleSaveUsername,
      })}
      {renderModal({
        visible: isPasswordModalVisible,
        onClose: () => setIsPasswordModalVisible(false),
        title: "Change Password",
        inputs: [
          { placeholder: "Enter current password", secure: true, value: currentPassword, onChangeText: setCurrentPassword },
          { placeholder: "Enter new password", secure: true, value: newPassword, onChangeText: setNewPassword },
          { placeholder: "Confirm new password", secure: true, value: confirmPassword, onChangeText: setConfirmPassword },
        ],
        onSubmit: handleSavePassword,
      })}
      {renderModal({
        visible: isDeleteModalVisible,
        onClose: () => setIsDeleteModalVisible(false),
        title: "Delete Account",
        isDanger: true,
        inputs: [
          { placeholder: "Enter password", secure: true, value: deletePassword, onChangeText: setDeletePassword },
          { placeholder: "Confirm password", secure: true, value: confirmDeletePassword, onChangeText: setConfirmDeletePassword },
        ],
        onSubmit: handleConfirmDelete,
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight || 0 : 0 },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1 },
  backButton: { padding: 4, borderRadius: 10 },
  headerText: { fontSize: 22, fontWeight: "bold", textAlign: "center", flex: 1 },
  scrollContent: { padding: 20 },
  settingsOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  settingsText: { fontSize: 16, fontWeight: "600", marginLeft: 10 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContainer: { width: "85%", padding: 20, borderRadius: 15, borderWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, borderWidth: 1 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalButton: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10 },
  cancelButton: { backgroundColor: "#333", marginRight: 8 },
  saveButton: { backgroundColor: "#ff4d4d", marginLeft: 8 },
  cancelText: { color: "#fff", fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "700" },
});
