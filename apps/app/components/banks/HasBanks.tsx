import React, { FC } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { IBank } from "@/store";

interface IProps {
  selectedBanks: Array<IBank["id"]>;
}

const HasBanks: FC<IProps> = ({ selectedBanks }) => {
  return (
    <View style={styles.container}>
      {/* Bank Status */}
      <View style={styles.bankStatus}>
        <Text style={styles.bankStatusText}>
          Tracking: {selectedBanks.map((bank) => bank).join(", ")}
        </Text>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions..."
      />
    </View>
  );
};

export default HasBanks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  bankStatus: {
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0284c7",
  },
  bankStatusText: {
    fontSize: 14,
    color: "#0c4a6e",
    fontWeight: "500",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
});
