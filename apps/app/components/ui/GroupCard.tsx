import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GroupCardProps {
  name: string;
  count: number;
  color: string;
  onDelete: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  name,
  count,
  color,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      {/* Left - Dot + Name */}
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.count}>{count} transactions</Text>
        </View>
      </View>

      {/* Delete Button */}
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
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
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  count: {
    fontSize: 13,
    color: "#666",
  },
});

export default GroupCard;
