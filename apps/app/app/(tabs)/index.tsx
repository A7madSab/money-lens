import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAppSelector } from "@/store";
import EmptyBanks from "@/components/banks/EmptyBanks";
import BankSelectionModal from "@/components/banks/BankSelectionModal";
import HasBanks from "@/components/banks/HasBanks";

export default function ExpenseTrackerScreen() {
  const [showBankModal, setShowBankModal] = useState(false);
  const { availableBanks, selectedBanks } = useAppSelector(
    (state) => state.banks,
  );
  const hasBanksSelected = selectedBanks.length > 0;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Expense Tracker</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setShowBankModal(true)}
          >
            <Text style={styles.settingsBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {!hasBanksSelected ? (
          <EmptyBanks setShowBankModal={setShowBankModal} />
        ) : (
          <HasBanks selectedBanks={selectedBanks} />
        )}
      </View>

      <BankSelectionModal
        visible={showBankModal}
        onClose={() => setShowBankModal(false)}
        selectedBanks={selectedBanks}
        availableBanks={availableBanks}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  settingsBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  settingsBtnText: {
    fontSize: 16,
  },
});
