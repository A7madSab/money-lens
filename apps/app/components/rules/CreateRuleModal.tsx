import React, { useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useForm } from "@tanstack/react-form";
import Feather from "@expo/vector-icons/Feather";
import {
  useAppDispatch,
  useAppSelector,
  addRuleWithReapply,
  CreateRulePayload,
} from "@/store";
import uuid from "react-native-uuid";

interface CreateRuleModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateRuleModal: React.FC<CreateRuleModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { groups } = useAppSelector((state) => state.groups);

  const form = useForm({
    defaultValues: {
      name: "",
      contains: "",
      groupId: groups.length > 0 ? groups[0].id : "",
    },
    onSubmit: async ({ value }) => {
      try {
        const newRule: CreateRulePayload = {
          id: uuid.v4(),
          name: value.name,
          contains: value.contains,
          groupId: value.groupId,
        };
        await dispatch(addRuleWithReapply(newRule));
        handleClose();
      } catch (error) {
        console.error("Error creating rule:", error);
      }
    },
  });

  // Update form when groups are loaded
  useEffect(() => {
    if (groups.length > 0 && !form.state.values.groupId) {
      form.setFieldValue("groupId", groups[0].id);
    }
  }, [groups, form]);

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
            <Text style={styles.modalTitle}>Create Rule</Text>
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
                  ? "Rule name must be at least 2 characters"
                  : undefined,
            }}
          >
            {(field) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Rule Name</Text>
                <TextInput
                  placeholder="Enter rule name"
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

          <form.Field
            name="contains"
            validators={{
              onChange: ({ value }) =>
                !value || value.trim().length < 1
                  ? "Description pattern is required"
                  : undefined,
            }}
          >
            {(field) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Description Contains</Text>
                <TextInput
                  placeholder="e.g., AMAZON, SWIGGY, UBER"
                  style={[
                    styles.input,
                    field.state.meta.errors.length > 0 && styles.inputError,
                  ]}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  multiline
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={styles.errorText}>
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          <form.Field
            name="groupId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Please select a group" : undefined,
            }}
          >
            {(field) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Assign to Group</Text>
                <View
                  style={[
                    styles.pickerContainer,
                    field.state.meta.errors.length > 0 && styles.inputError,
                  ]}
                >
                  <Picker
                    selectedValue={field.state.value}
                    style={styles.picker}
                    onValueChange={field.handleChange}
                  >
                    <Picker.Item label="Select a group..." value="" />
                    {groups.map((group) => (
                      <Picker.Item
                        key={group.id}
                        label={group.name}
                        value={group.id}
                      />
                    ))}
                  </Picker>
                </View>
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
                {form.state.isSubmitting ? "Creating..." : "Create Rule"}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
  },
  picker: {
    height: 50,
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

export default CreateRuleModal;