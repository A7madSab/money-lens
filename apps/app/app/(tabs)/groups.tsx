import GroupCard from "@/components/ui/GroupCard";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Group {
  id: string;
  name: string;
  color: string;
  count: number;
}

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "Food & Dining", color: "red", count: 3 },
    { id: "2", name: "Fuel", color: "blue", count: 2 },
    { id: "3", name: "Shopping", color: "green", count: 2 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const addGroup = () => {
    if (!newGroupName.trim()) return;
    setGroups((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newGroupName,
        color: randomColor(),
        count: 0,
      },
    ]);
    setNewGroupName("");
    setModalVisible(false);
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const randomColor = () => {
    const colors = ["#FF6B6B", "#4dabf7", "#51cf66", "#f59f00", "#9b5de5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Groups</Text>

      {/* Add Group Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Group</Text>
      </TouchableOpacity>

      {/* Group List */}
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard
            name={item.name}
            count={item.count}
            color={item.color}
            onDelete={() => deleteGroup(item.id)}
          />
        )}
      />

      {/* Modal for Adding Group */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Group</Text>
            <TextInput
              placeholder="Enter group name"
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addGroup}>
                <Text style={styles.create}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  cancel: {
    color: "red",
    fontWeight: "500",
  },
  create: {
    color: "blue",
    fontWeight: "600",
  },
});
