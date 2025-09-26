import React, { useState } from "react";
import { Card, Typography, Box, Chip, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store";
import { deleteGroupWithCleanup } from "@/store/slices/groupsSlice";
import { GroupsForm } from "./GroupForm";

export const GroupsTab = () => {
  const dispatch = useAppDispatch();
  const { groups } = useAppSelector((state) => ({
    groups: state.groups.groups,
  }));
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteGroup = (groupId: string) => {
    dispatch(deleteGroupWithCleanup(groupId));
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Groups Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Organize your transactions by creating and managing groups
      </Typography>

      <GroupsForm />

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">
            All Groups ({filteredGroups.length})
          </Typography>
          <TextField
            size="small"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>

        {filteredGroups.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
            <Typography variant="body1">
              {searchTerm
                ? "No groups match your search."
                : "No groups created yet. Create your first group to start organizing transactions."}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {filteredGroups.map((group) => (
              <Chip
                key={group.id}
                label={group.name}
                onDelete={() => handleDeleteGroup(group.id)}
                deleteIcon={<Close fontSize="small" />}
                sx={{
                  backgroundColor: group.color,
                  color: "white",
                  fontWeight: 500,
                  "& .MuiChip-deleteIcon": {
                    color: "white",
                    "&:hover": {
                      color: "grey.200",
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
};
