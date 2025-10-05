import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { IBank } from "@money-lens/core";

interface IProps {
  bank: IBank;
  isSelected: boolean;
  handleBankToggle: (bankId: string) => void;
}

// Import bank logos
const BANK_LOGOS: Record<string, any> = {
  CIB: require("@/assets/images/cib.png"),
  BANK_ALAHLY: require("@/assets/images/nbe.png"),
  BANQUE_MISR: require("@/assets/images/banuqe-masr.png"),
};

const BankCard: FC<IProps> = ({ bank, isSelected, handleBankToggle }) => {
  return (
    <TouchableOpacity
      key={bank.id}
      style={[
        styles.bankOption,
        isSelected && styles.bankOptionSelected,
        { borderLeftColor: bank.color },
      ]}
      onPress={() => handleBankToggle(bank.id)}
    >
      <View style={styles.bankContent}>
        {/* Bank Logo */}
        {BANK_LOGOS[bank.id] && (
          <View style={styles.logoContainer}>
            <Image source={BANK_LOGOS[bank.id]} style={styles.logo} />
          </View>
        )}

        <View style={styles.bankInfo}>
          <Text
            style={[styles.bankName, isSelected && styles.bankNameSelected]}
          >
            {bank.displayName}
          </Text>
          <Text style={styles.bankAddresses}>
            SMS from: {bank.addresses.join(", ")}
          </Text>
          {bank.arabicNames && bank.arabicNames.length > 0 && (
            <Text style={styles.bankArabicNames}>
              {bank.arabicNames.join(", ")}
            </Text>
          )}
        </View>
        <View style={styles.checkboxContainer}>
          {isSelected ? (
            <View style={[styles.checkbox, styles.checkboxSelected]}>
              <Feather name="check" size={16} color="#fff" />
            </View>
          ) : (
            <View style={styles.checkbox} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bankOption: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  bankOptionSelected: {
    backgroundColor: "#f8fafc",
    borderColor: "#3b82f6",
  },
  bankContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  bankNameSelected: {
    color: "#1d4ed8",
  },
  bankAddresses: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  bankArabicNames: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

export default BankCard;
