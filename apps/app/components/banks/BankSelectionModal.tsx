import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useAppDispatch, toggleBank, IBank } from "@/store";
import BankCard from "./BankCard";

interface IProps {
  visible: boolean;
  onClose: () => void;
  availableBanks: IBank[];
  selectedBanks: Array<IBank["id"]>;
}

const BankSelectionModal: React.FC<IProps> = ({
  visible,
  onClose,
  selectedBanks,
  availableBanks,
}) => {
  const dispatch = useAppDispatch();
  const handleBankToggle = (bankId: string) => dispatch(toggleBank(bankId));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Select Your Banks</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Choose the banks you want to track SMS transactions from. You can
            select multiple banks.
          </Text>

          {/* Banks List */}
          <ScrollView
            style={styles.banksContainer}
            showsVerticalScrollIndicator={false}
          >
            {availableBanks && availableBanks.length > 0 ? (
              availableBanks.map((bank) => {
                const isSelected = selectedBanks.includes(bank.id);

                return (
                  <BankCard
                    key={bank.id}
                    isSelected={isSelected}
                    bank={bank}
                    handleBankToggle={handleBankToggle}
                  />
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No banks available. Please check your configuration.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.selectedCount}>
              {selectedBanks.length} bank{selectedBanks.length !== 1 ? "s" : ""}{" "}
              selected
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.doneButton,
                selectedBanks.length === 0 && styles.doneButtonDisabled,
              ]}
              disabled={selectedBanks.length === 0}
            >
              <Text
                style={[
                  styles.doneButtonText,
                  selectedBanks.length === 0 && styles.doneButtonTextDisabled,
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    paddingHorizontal: 20,
    paddingVertical: 16,
    lineHeight: 20,
  },
  banksContainer: {
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  selectedCount: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  doneButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  doneButtonTextDisabled: {
    color: "#9ca3af",
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default BankSelectionModal;
