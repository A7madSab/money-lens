import React, { useEffect } from "react";
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
import {
  useAppDispatch,
  useAppSelector,
  updateGroup,
  IGroup,
} from "@/store";

interface EditGroupModalProps {
  visible: boolean;
  group: IGroup | null;
  onClose: () => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  visible,
  group,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { rules } = useAppSelector((state) => state.rules);

  // Get count of rules using this group
  const ruleCount = group
    ? rules.filter((rule) => rule.groupId === group.id).length
    : 0;

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      if (!group) return;

      try {
        const updatedGroup: IGroup = {
          ...group,
          name: value.name,
        };
        dispatch(updateGroup(updatedGroup));
        handleClose();
      } catch (error) {
        console.error("Error updating group:", error);
      }
    },
  });

  // Update form when group changes
  useEffect(() => {
    if (group && visible) {
      form.setFieldValue("name", group.name);
    }
  }, [group, visible, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!group) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Edit Group</Text>
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
                  placeholder="Enter group name"
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

          {/* Group Info */}
          <View style={styles.infoSection}>
            <View style={styles.colorPreview}>
              <Text style={styles.infoLabel}>Color:</Text>
              <View
                style={[
                  styles.colorChip,
                  { backgroundColor: group.color },
                ]}
              />
            </View>

            <View style={styles.statsContainer}>
              <Text style={styles.infoLabel}>Rules using this group:</Text>
              <Text style={styles.statsText}>
                {ruleCount} rule{ruleCount !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={form.handleSubmit}
              disabled={!form.state.canSubmit || form.state.isSubmitting}
              style={[
                styles.updateButton,
                (!form.state.canSubmit || form.state.isSubmitting) &&
                  styles.updateButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.updateText,
                  (!form.state.canSubmit || form.state.isSubmitting) &&
                    styles.updateTextDisabled,
                ]}
              >
                {form.state.isSubmitting ? "Updating..." : "Update Group"}
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
  infoSection: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  colorPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  colorChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statsText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
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
  updateButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  updateTextDisabled: {
    color: "#ccc",
  },
});

export default EditGroupModal;