import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

interface RuleCardProps {
  name: string;
  contains: string;
  group: string;
  active: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({
  name,
  contains,
  group,
  active,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      {/* Rule Info */}
      <View style={{ flex: 1 }}>
        <Text style={styles.ruleName}>{name}</Text>
        <Text style={styles.contains}>Contains: &quot;{contains}&quot</Text>
        <Text style={styles.group}>Assign to: {group}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Switch value={active} onValueChange={onToggle} />
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="pencil-outline" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  ruleName: {
    fontSize: 16,
    fontWeight: "600",
  },
  contains: {
    fontSize: 13,
    color: "#555",
  },
  group: {
    fontSize: 13,
    color: "#007AFF",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default RuleCard;
