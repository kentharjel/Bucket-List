import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router } from "expo-router"; // ✅ import router
import { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useList } from "../hooks/useList";
import { useTheme } from "../hooks/useTheme";

export default function DoneList() {
  const { lists, deleteList, toggleListDone } = useList();
  const { isDarkMode, themeStyles } = useTheme();

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // ✅ Show only done lists
  const doneLists = lists.filter((item) => item.done);

  const handleDelete = async (item) => {
    setDeleteModalVisible(false);
    await deleteList(item.id);
  };

  const headerBg = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const headerTextColor = themeStyles.text.color;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeStyles.container.backgroundColor },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        {/* ✅ Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color={headerTextColor}
          />
        </TouchableOpacity>

        <Text style={[styles.headerText, { color: headerTextColor }]}>
          Done Lists
        </Text>
      </View>

      {/* Done List Items */}
      <FlatList
        data={doneLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              setSelectedItem(item);
              setDeleteModalVisible(true);
            }}
            style={[
              styles.listItem,
              { backgroundColor: isDarkMode ? "#1a1a1a" : "#fff" },
            ]}
          >
            <Checkbox
              value={true}
              onValueChange={() => toggleListDone(item.id, false)} // ✅ uncheck to move back
              color={"royalblue"}
            />
            <Text
              style={[
                styles.listText,
                { color: "#888", textDecorationLine: "line-through" },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: isDarkMode ? "#333" : "#ccc",
              marginVertical: 4,
            }}
          />
        )}
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyText,
              { color: isDarkMode ? "#aaa" : "#555" },
            ]}
          >
            No completed lists yet.
          </Text>
        }
      />

      {/* Delete Modal */}
      <Modal
        transparent
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: isDarkMode ? "#222" : "#fff" },
            ]}
          >
            <Ionicons
              name="trash"
              size={40}
              color="red"
              style={{ marginBottom: 10 }}
            />
            <Text
              style={[
                styles.modalTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Delete this list?
            </Text>
            <Text
              style={[
                styles.modalMessage,
                { color: isDarkMode ? "#ccc" : "#444" },
              ]}
            >
              "{selectedItem?.title}"
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: isDarkMode ? "#555" : "#ccc" },
                ]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(selectedItem)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: { fontSize: 24, fontWeight: "bold" },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 1,
  },
  listContent: { padding: 15 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalBox: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: { fontWeight: "bold" },
  deleteButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 6,
    alignItems: "center",
    marginLeft: 8,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
});
