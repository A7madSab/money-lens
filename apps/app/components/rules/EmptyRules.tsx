import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { IRule } from "@money-lens/core";

interface IProps {
  rules: IRule[];
}

const EmptyRules: FC<IProps> = ({ rules }) => {
  return (
    <View style={styles.emptyState}>
      <Feather name="sliders" size={48} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {rules.length === 0 ? "No rules yet" : "No matching rules"}
      </Text>
      <Text style={styles.emptyText}>
        {rules.length === 0
          ? "Create your first rule to automatically organize transactions"
          : "Try adjusting your search or filter"}
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

export default EmptyRules;
