import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccount } from "../../hooks/useAccount";
import { useList } from "../../hooks/useList";

export default function List() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [list, setList] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(null); // which list has 3-dot modal open

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
        <Text style={styles.headerText} allowFontScaling={false}>Bucket List</Text>
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
              color={item.done ? "royalblue" : undefined}
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
              style={{ marginLeft: "auto" }}
              onPress={() => setOptionsVisible(item.id)}
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
                  >
                    <Text style={styles.optionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      setOptionsVisible(null);
                      handleDelete(item);
                    }}
                  >
                    <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => setOptionsVisible(null)}
                  >
                    <Text style={styles.optionText}>Exit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
            No items yet. Add one!
          </Text>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#000" />
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
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
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
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleEdit}>
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
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 35,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  listText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
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
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelText: {
    color: "#000",
    fontWeight: "bold",
  },
  addButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "royalblue",
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  optionsBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
  },
  optionButton: {
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
