import RuleCard from "@/components/ui/RuleCard";
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

interface Rule {
  id: string;
  name: string;
  contains: string;
  group: string;
  active: boolean;
}

export default function AutomationRulesScreen() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      name: "Food Rule",
      contains: "SWIGGY",
      group: "Food",
      active: true,
    },
    {
      id: "2",
      name: "Shopping Rule",
      contains: "AMAZON",
      group: "Shopping",
      active: true,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [contains, setContains] = useState("");
  const [group, setGroup] = useState("Food");

  const addRule = () => {
    if (!ruleName.trim() || !contains.trim()) return;
    setRules((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: ruleName,
        contains,
        group,
        active: true,
      },
    ]);
    setRuleName("");
    setContains("");
    setGroup("Food");
    setModalVisible(false);
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Automation Rules</Text>

      {/* Add Rule Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Rule</Text>
      </TouchableOpacity>

      {/* Rules List */}
      <FlatList
        data={rules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RuleCard
            name={item.name}
            contains={item.contains}
            group={item.group}
            active={item.active}
            onToggle={() => toggleRule(item.id)}
            onDelete={() => deleteRule(item.id)}
            onEdit={() => {
              setRuleName(item.name);
              setContains(item.contains);
              setGroup(item.group);
              setModalVisible(true);
            }}
          />
        )}
      />

      {/* Modal for Creating Rule */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Rule</Text>

            <TextInput
              placeholder="Rule Name"
              style={styles.input}
              value={ruleName}
              onChangeText={setRuleName}
            />
            <TextInput
              placeholder="Description Contains"
              style={styles.input}
              value={contains}
              onChangeText={setContains}
            />
            {/* <Picker
              selectedValue={group}
              style={styles.input}
              onValueChange={(val) => setGroup(val)}
            >
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Fuel" value="Fuel" />
              <Picker.Item label="Shopping" value="Shopping" />
            </Picker> */}

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addRule}>
                <Text style={styles.create}>Save</Text>
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
    width: "85%",
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
    marginBottom: 12,
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
