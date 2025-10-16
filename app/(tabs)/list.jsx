import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccount } from "../../hooks/useAccount";
import { useList } from "../../hooks/useList";
import { useTheme } from "../../hooks/useTheme";

// ...imports remain the same
export default function List() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [list, setList] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(null);

  const { createList, lists, toggleListDone, deleteList, updateList } = useList();
  const { currentUser } = useAccount();
  const { isDarkMode, themeStyles } = useTheme();

  const handleAdd = async () => {
    Keyboard.dismiss();
    if (!list.trim()) {
      Alert.alert("Error!", "List should not be empty");
      return;
    }

    await createList({ title: list, items: [] });
    setList("");
    setModalVisible(false);
  };

  const handleEdit = async () => {
    if (!list.trim() || !editingItem) return;
    await updateList(editingItem.id, { title: list });
    setEditingItem(null);
    setList("");
    setEditModalVisible(false);
  };

  const handleDelete = (item) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: () => deleteList(item.id) },
    ]);
  };

  const headerBg = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const headerTextColor = themeStyles.text.color;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.container.backgroundColor }]}>
      {/* Header matches Profile header */}
      <View style={[styles.profileHeader, { backgroundColor: headerBg }]}>
        <Text style={[styles.profileHeaderText, { color: headerTextColor }]}>
          Bucket List
        </Text>
      </View>

      {/* List Items */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.listItem, { backgroundColor: isDarkMode ? "#1a1a1a" : "#fff" }]}>
            <Checkbox
              value={item.done}
              onValueChange={() => toggleListDone(item.id, !item.done)}
              color={item.done ? "royalblue" : "gray"}
            />
            <Text
              style={[
                styles.listText,
                { color: themeStyles.text.color },
                item.done && { textDecorationLine: "line-through", color: "#888" },
              ]}
            >
              {item.title}
            </Text>

            <TouchableOpacity style={styles.optionsButton} onPress={() => setOptionsVisible(item.id)}>
              <Ionicons name="ellipsis-vertical" size={20} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>

            {/* Options Modal */}
            <Modal
              transparent
              visible={optionsVisible === item.id}
              animationType="fade"
              onRequestClose={() => setOptionsVisible(null)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.optionsBox}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      setOptionsVisible(null);
                      setEditingItem(item);
                      setList(item.title);
                      setEditModalVisible(true);
                    }}
                  >
                    <Text style={styles.optionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.optionButton, { borderTopWidth: 1, borderTopColor: "#ddd" }]}
                    onPress={() => {
                      setOptionsVisible(null);
                      handleDelete(item);
                    }}
                  >
                    <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.optionButton, { borderTopWidth: 1, borderTopColor: "#ddd" }]}
                    onPress={() => setOptionsVisible(null)}
                  >
                    <Text style={styles.optionText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: isDarkMode ? "#333" : "#ccc", marginVertical: 4 }} />}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: isDarkMode ? "#aaa" : "#555" }]}>No items yet. Add one!</Text>}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color={isDarkMode ? "#000" : "#fff"} />
      </TouchableOpacity>

      {/* Add/Edit Modals */}
      {["add", "edit"].map((mode) => {
        const visible = mode === "add" ? modalVisible : editModalVisible;
        const onClose = mode === "add" ? () => setModalVisible(false) : () => setEditModalVisible(false);
        const onSubmit = mode === "add" ? handleAdd : handleEdit;
        const titleText = mode === "add" ? "Add List" : "Edit List";

        return (
          <Modal key={mode} animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalView, { backgroundColor: isDarkMode ? "#222" : "#fff" }]}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? "#fff" : "#000" }]}>{titleText}</Text>
                <TextInput
                  style={[styles.input, { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#ccc" }]}
                  placeholder="Enter your bucket list..."
                  placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                  value={list}
                  onChangeText={setList}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.cancelButton, { backgroundColor: isDarkMode ? "#555" : "#ccc" }]} onPress={onClose}>
                    <Text style={[styles.cancelText, { color: isDarkMode ? "#fff" : "#000" }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
                    <Text style={styles.addText}>{mode === "add" ? "Add" : "Save"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  profileHeaderText: { fontSize: 24, fontWeight: "bold" },

  listContent: { padding: 15 },
  listItem: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8, marginBottom: 8 },
  listText: { fontSize: 16, marginLeft: 10, flex: 1 },
  optionsButton: { marginLeft: "auto" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  fab: { position: "absolute", bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 4, backgroundColor: "royalblue" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalView: { borderRadius: 10, padding: 20, width: "85%", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { width: "100%", borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 15, fontSize: 16 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { flex: 1, padding: 10, borderRadius: 6, alignItems: "center", marginRight: 8 },
  cancelText: { fontWeight: "bold" },
  addButton: { flex: 1, padding: 10, backgroundColor: "royalblue", borderRadius: 6, alignItems: "center", marginLeft: 8 },
  addText: { color: "#fff", fontWeight: "bold" },
  optionsBox: { backgroundColor: "#fff", padding: 15, borderRadius: 8, width: "70%", alignItems: "center" },
  optionButton: { padding: 10, width: "100%", alignItems: "center" },
  optionText: { fontSize: 16, fontWeight: "600" },
});
