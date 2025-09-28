import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm } from "@tanstack/react-form";
import Feather from "@expo/vector-icons/Feather";
import { useAppDispatch, addGroup } from "@/store";
import uuid from "react-native-uuid";

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      try {
        dispatch(addGroup({ id: uuid.v4(), name: value.name }));
        handleClose();
      } catch (error) {
        console.error("Error creating group:", error);
      }
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Create Group</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value || value.trim().length < 2
                  ? "Group name must be at least 2 characters"
                  : undefined,
            }}
          >
            {(field) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Group Name</Text>
                <TextInput
                  placeholder="Enter group name (e.g., Food, Transport)"
                  style={[
                    styles.input,
                    field.state.meta.errors.length > 0 && styles.inputError,
                  ]}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={styles.errorText}>
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={form.handleSubmit}
              disabled={!form.state.canSubmit || form.state.isSubmitting}
              style={[
                styles.createButton,
                (!form.state.canSubmit || form.state.isSubmitting) &&
                  styles.createButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.createText,
                  (!form.state.canSubmit || form.state.isSubmitting) &&
                    styles.createTextDisabled,
                ]}
              >
                {form.state.isSubmitting ? "Creating..." : "Create Group"}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#000",
    minHeight: 48,
  },
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 2,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createTextDisabled: {
    color: "#ccc",
  },
});

export default CreateGroupModal;
