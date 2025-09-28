import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IBank } from "@money-lens/core";

interface BankCardProps {
  bank: IBank;
  isSelected: boolean;
  onToggle: (bankId: string) => void;
}

const BankCard: React.FC<BankCardProps> = ({ bank, isSelected, onToggle }) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: bank.color },
        isSelected && { backgroundColor: "#f0f9ff", borderColor: bank.color },
      ]}
      onPress={() => onToggle(bank.id)}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.displayName}>{bank.displayName}</Text>
          <View
            style={[
              styles.checkbox,
              { borderColor: bank.color },
              isSelected && { backgroundColor: bank.color },
            ]}
          >
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>

        <Text style={styles.bankName}>{bank.id}</Text>

        <View style={styles.addressSection}>
          <Text style={styles.addressLabel}>SMS Addresses:</Text>
          <Text style={styles.addresses}>{bank.addresses.join(", ")}</Text>
        </View>

        {bank.arabicNames && bank.arabicNames.length > 0 && (
          <View style={styles.arabicSection}>
            <Text style={styles.arabicLabel}>Arabic Names:</Text>
            <Text style={styles.arabicNames}>
              {bank.arabicNames.join(", ")}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  displayName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  bankName: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  addressSection: {
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  addresses: {
    fontSize: 12,
    color: "#4b5563",
    fontFamily: "monospace",
  },
  arabicSection: {
    marginTop: 8,
  },
  arabicLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  arabicNames: {
    fontSize: 12,
    color: "#4b5563",
    textAlign: "right",
  },
});

export default BankCard;
