import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  Grid,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useForm } from "@tanstack/react-form";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addRuleWithReapply,
  updateRuleWithReapply,
  IRule,
} from "@/store/slices/rulesSlice";

interface RulesFormProps {
  editingRule?: IRule | null;
  onCancelEdit?: () => void;
}

export const RulesForm = ({ editingRule, onCancelEdit }: RulesFormProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const dispatch = useAppDispatch();
  const { groups } = useAppSelector((state) => state.groups);

  const isEditing = !!editingRule;

  const form = useForm({
    defaultValues: {
      name: editingRule?.name || "",
      contains: editingRule?.contains || "",
      groupId: editingRule?.groupId || "",
    },
    onSubmit: async ({ value }) => {
      if (isEditing && editingRule) {
        // Update existing rule
        dispatch(
          updateRuleWithReapply({
            ...editingRule,
            ...value,
          })
        );
        onCancelEdit?.();
      } else {
        // Create new rule
        dispatch(addRuleWithReapply(value));
        form.reset();
        setShowCreateForm(false);
      }
    },
  });

  // Reset form when editing rule changes
  useEffect(() => {
    if (editingRule) {
      form.reset();
      form.setFieldValue("name", editingRule.name);
      form.setFieldValue("contains", editingRule.contains);
      form.setFieldValue("groupId", editingRule.groupId);
      setShowCreateForm(true); // Show form when editing
    }
  }, [editingRule, form]);

  const handleCancel = () => {
    if (isEditing) {
      onCancelEdit?.();
    }

    form.reset();
    setShowCreateForm(false);
  };

  const handleAddRule = () => {
    setShowCreateForm(true);
  };

  const renderForm = () => {
    if (!showCreateForm && !isEditing)
      return (
        <Button
          size="small"
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRule}
        >
          Add Rule
        </Button>
      );

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Grid container spacing={2} pb={2}>
          <Grid container size={{ xs: 6 }}>
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value || value.trim().length === 0
                    ? "Rule name is required"
                    : undefined,
              }}
            >
              {(field) => (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Rule Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g., Food Purchases"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors.join(", ")}
                  />
                </Box>
              )}
            </form.Field>
          </Grid>

          <Grid container size={{ xs: 6 }}>
            <form.Field
              name="groupId"
              validators={{
                onChange: ({ value }) =>
                  !value || value.trim().length === 0
                    ? "Please select a group"
                    : undefined,
              }}
            >
              {(field) => (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Assign to Group
                  </Typography>
                  <Select
                    fullWidth
                    sx={{ backgroundColor: "white" }}
                    size="small"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select group
                    </MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
            </form.Field>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <form.Field
              name="contains"
              validators={{
                onChange: ({ value }) =>
                  !value || value.trim().length === 0
                    ? "Rule name is required"
                    : undefined,
              }}
            >
              {(field) => (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Contains
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    placeholder="e.g., Food Purchases"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors.join(", ")}
                  />
                </Box>
              )}
            </form.Field>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 1 }}>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                size="small"
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                sx={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Rule"
                  : "Create Rule"}
              </Button>
            )}
          </form.Subscribe>
          <Button size="small" variant="text" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Card variant="outlined" sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {isEditing ? "Edit Rule" : "Create New Rule"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Rules automatically assign transactions to groups when their description
        contains specific text
      </Typography>

      {renderForm()}
    </Card>
  );
};
