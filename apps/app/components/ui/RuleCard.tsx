import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { IGroup, IRule } from "@/store";

interface IProps {
  rule: IRule;
  group: IGroup;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const RuleCard: React.FC<IProps> = ({
  rule,
  onToggle,
  onDelete,
  onEdit,
  group,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_LENGTH = 25;
  const isLong = rule.contains.length > MAX_LENGTH;

  const displayText =
    isExpanded || !isLong ? rule.contains : rule.contains.slice(0, MAX_LENGTH);

  return (
    <View style={styles.card}>
      {/* Rule Info */}
      <View style={{ flex: 1 }}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.ruleName,
              { color: rule.isActive ? "#000" : "#666" },
            ]}
          >
            {rule.name}
          </Text>
          {!rule.isActive && (
            <View style={styles.inactiveChip}>
              <Text style={styles.inactiveChipText}>Inactive</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => isLong && setIsExpanded(!isExpanded)}
        >
          <Text style={styles.contains}>
            When description contains: &quot;{displayText}
            {!isExpanded && isLong && "..."}&quot;
          </Text>
        </TouchableOpacity>

        <View style={styles.groupContainer}>
          <View
            style={[
              styles.groupChip,
              {
                backgroundColor: rule.isActive ? group.color : "#999",
              },
            ]}
          >
            <Text style={styles.groupText}>{group.name}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Switch
          trackColor={{ false: "#d6d6d6", true: group.color }}
          thumbColor={rule.isActive ? "#fff" : "#f4f3f4"}
          value={rule.isActive}
          onValueChange={onToggle}
        />
        <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
          <Feather name="edit-2" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
          <Octicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: "600",
  },
  inactiveChip: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  inactiveChipText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  contains: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 4,
  },
  readMoreText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  groupContainer: {
    flexDirection: "row",
  },
  groupChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  groupText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default RuleCard;
