import React, { Dispatch, FC, SetStateAction } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface IProps {
  setShowBankModal: Dispatch<SetStateAction<boolean>>;
}

const EmptyBanks: FC<IProps> = ({ setShowBankModal }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bankConfigContainer}>
        <Text style={styles.bankConfigTitle}>Configure Your Banks</Text>
        <Text style={styles.bankConfigSubtitle}>
          Please select your banks to start tracking SMS transactions.
        </Text>

        <TouchableOpacity
          style={styles.configureBtn}
          onPress={() => {
            console.log("jhellplmsad");
            setShowBankModal(true);
          }}
        >
          <Text style={styles.configureBtnText}>Select Banks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  bankConfigContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  bankConfigTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  bankConfigSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  configureBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  configureBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default EmptyBanks;
