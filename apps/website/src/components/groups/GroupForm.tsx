import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "@/store";
import { addGroup } from "@/store/slices/groupsSlice";
import { useForm } from "@tanstack/react-form";

export const GroupsForm = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const dispatch = useAppDispatch();

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      dispatch(addGroup(value.name));
      // Reset form and hide it after successful submission
      form.reset();
      setShowCreateForm(false);
    },
  });

  const handleCancel = () => {
    form.reset();
    setShowCreateForm(false);
  };

  const handleAddGroup = () => {
    setShowCreateForm(true);
  };

  const renderForm = () => {
    if (!showCreateForm)
      return (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddGroup}
          size="small"
        >
          Add Group
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
        <Box sx={{ display: "flex", gap: 2, alignItems: "start" }}>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value || value.trim().length === 0
                  ? "Group name is required"
                  : undefined,
            }}
          >
            {(field) => (
              <TextField
                size="small"
                placeholder="e.g., Food & Dining"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={!!field.state.meta.errors.length}
                helperText={field.state.meta.errors.join(", ")}
                sx={{ width: 200 }}
              />
            )}
          </form.Field>

          <Box sx={{ display: "flex", gap: 1 }}>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canSubmit}
                  size="small"
                  sx={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              )}
            </form.Subscribe>
            <Button variant="text" onClick={handleCancel} size="small">
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
    );
  };

  return (
    <Card variant="outlined" sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Create New Group
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create groups to categorize your financial transactions
      </Typography>

      {renderForm()}
    </Card>
  );
};
