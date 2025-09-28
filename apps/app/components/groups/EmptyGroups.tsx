import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { IGroup } from "@/store";

interface EmptyGroupsProps {
  groups: IGroup[];
  onCreateGroup?: () => void;
}

const EmptyGroups: React.FC<EmptyGroupsProps> = ({ groups }) => {
  return (
    <View style={styles.emptyState}>
      <Feather name="folder-plus" size={48} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {groups.length === 0 ? "No groups yet" : "No matching groups"}
      </Text>
      <Text style={styles.emptyText}>
        {groups.length === 0
          ? "Create your first group to organize your transactions by category"
          : "Try adjusting your search to find groups"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
});

export default EmptyGroups;
