import React, { useState } from "react";
import { Card, Typography, Box, Chip, IconButton, Switch } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { RulesForm } from "./RulesForm";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  deleteRule,
  toggleRuleActiveWithReapply,
  IRule,
} from "@/store/slices/rulesSlice";

const RulesTab = () => {
  const dispatch = useAppDispatch();
  const [editingRule, setEditingRule] = useState<IRule | null>(null);

  const { rules, activeRules } = useAppSelector((state) => ({
    rules: state.rules.rules,
    activeRules: state.rules.rules.filter((rule) => rule.isActive),
  }));
  const { groups } = useAppSelector((state) => state.groups);

  const handleDeleteRule = (ruleId: string) => {
    dispatch(deleteRule(ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    dispatch(toggleRuleActiveWithReapply(ruleId));
  };

  const handleEditRule = (rule: IRule) => {
    setEditingRule(rule);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  const getGroupName = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    return group?.name || "Unknown Group";
  };

  const getGroupColor = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    return group?.color || "#666";
  };

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Automation Rules
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create rules to automatically assign transactions to groups based on
        description content
      </Typography>

      <RulesForm
        editingRule={editingRule}
        onCancelEdit={handleCancelEdit}
      />

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Active Rules ({activeRules.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your automation rules. Rules are applied automatically when
          uploading CSV files.
        </Typography>

        {rules.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
            <Typography variant="body1">
              No rules created yet. Create your first rule to automatically
              organize transactions.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rules.map((rule) => (
              <Card
                key={rule.id}
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  opacity: rule.isActive ? 1 : 0.5,
                  backgroundColor: rule.isActive
                    ? "background.paper"
                    : "grey.50",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: rule.isActive ? "text.primary" : "text.secondary",
                    }}
                  >
                    {rule.name}
                    {!rule.isActive && (
                      <Chip
                        label="Inactive"
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor: "grey.300",
                          color: "grey.600",
                          fontSize: "0.75rem",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    When description contains: &quot;{rule.contains}&quot;
                  </Typography>
                  <Chip
                    label={getGroupName(rule.groupId)}
                    size="small"
                    sx={{
                      backgroundColor: rule.isActive
                        ? getGroupColor(rule.groupId)
                        : "grey.400",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Switch
                    checked={rule.isActive}
                    onChange={() => handleToggleRule(rule.id)}
                    size="small"
                  />
                  <IconButton
                    onClick={() => handleEditRule(rule)}
                    color="primary"
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteRule(rule.id)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default RulesTab;
