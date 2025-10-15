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

export default function List() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [list, setList] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(null);

  const { createList, lists, toggleListDone, deleteList, updateList } = useList();
  const { currentUser } = useAccount();

  const handleAdd = async () => {
    Keyboard.dismiss();

    if (!list.trim()) {
      Alert.alert("Error!", "List should not be empty");
      return;
    }

    await createList({
      username: currentUser,
      text: list,
      done: false,
      createdAt: new Date(),
    });

    setList("");
    setModalVisible(false);
  };

  const handleEdit = async () => {
    if (!list.trim() || !editingItem) return;

    await updateList(editingItem.id, { text: list });
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText} allowFontScaling={false} accessibilityRole="header">
          Bucket List
        </Text>
      </View>

      {/* Render list items */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Checkbox
              value={item.done}
              onValueChange={() => toggleListDone(item.id, !item.done)}
              color={item.done ? "royalblue" : "gray"} // Fixed incomplete color prop
              accessibilityLabel={`Mark ${item.text} as done`}
            />
            <Text
              style={[
                styles.listText,
                item.done && { textDecorationLine: "line-through", color: "#888" },
              ]}
              allowFontScaling={false}
            >
              {item.text}
            </Text>

            {/* 3 Dots Button */}
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => setOptionsVisible(item.id)}
              accessibilityLabel="Options menu"
              accessibilityRole="button"
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
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
                      setList(item.text);
                      setEditModalVisible(true);
                    }}
                    accessibilityLabel="Edit item"
                    accessibilityRole="button"
                  >
                    <Text style={styles.optionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.optionButton, { borderTopWidth: 1, borderTopColor: "#ddd" }]}
                    onPress={() => {
                      setOptionsVisible(null);
                      handleDelete(item);
                    }}
                    accessibilityLabel="Delete item"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.optionButton, { borderTopWidth: 1, borderTopColor: "#ddd" }]}
                    onPress={() => setOptionsVisible(null)}
                    accessibilityLabel="Close options"
                    accessibilityRole="button"
                  >
                    <Text style={styles.optionText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.emptyText} accessibilityRole="alert">
            No items yet. Add one!
          </Text>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add new item"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add List</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your bucket list..."
              placeholderTextColor="#aaa"
              value={list}
              onChangeText={setList}
              accessibilityLabel="Add list input"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Cancel add"
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAdd}
                accessibilityLabel="Add item"
                accessibilityRole="button"
              >
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit List</Text>
            <TextInput
              style={styles.input}
              placeholder="Edit your bucket list..."
              placeholderTextColor="#aaa"
              value={list}
              onChangeText={setList}
              accessibilityLabel="Edit list input"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
                accessibilityLabel="Cancel edit"
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleEdit}
                accessibilityLabel="Save changes"
                accessibilityRole="button"
              >
                <Text style={styles.addText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  listContent: {
    padding: 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  optionsButton: {
    marginLeft: "auto",
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 4,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: {
    color: "#000",
    fontWeight: "bold",
  },
  addButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "royalblue",
    borderRadius: 6,
    alignItems: "center",
    marginLeft: 8,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  optionsBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
  },
  optionButton: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
