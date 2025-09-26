import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SLICE_KEYS } from "../storage/config";
import { generateUUID, getRandomWarmColor } from "@/utils";
import { IAppStore } from "..";
import {
  removeGroupFromAllTransactions,
  reapplyAllRules,
} from "./transactionsSlice";
import { deleteRulesByGroupId, getActiveRules } from "./rulesSlice";

export interface IGroup {
  id: string;
  name: string;
  color: string;
}

const initialState: { groups: IGroup[] } = {
  groups: [
    {
      id: "1",
      name: "Food",
      color: "#FF6B6B",
    },
    {
      id: "2",
      name: "Transport",
      color: "#45B7D1",
    },
    {
      id: "3",
      name: "Petrol",
      color: "#FF8E53",
    },
    {
      id: "5",
      name: "Entertainment",
      color: "#A29BFE",
    },
    {
      id: "6",
      name: "Health",
      color: "#4ECDC4",
    },
    {
      id: "7",
      name: "Utilities",
      color: "#FFD93D",
    },
    {
      id: "8",
      name: "Cloth",
      color: "#FFD93D",
    },
    {
      id: "fda79c30-e7e1-4d0a-a6c0-e13c5c4eb62c",
      name: "E-Subscriptions",
      color: "#FF7675",
    },
    {
      id: "37185064-492f-46f3-813d-1f0cbcb995ec",
      name: "Utility",
      color: "#E84393",
    },
    {
      id: "89e0b546-9e56-4c7a-b34b-6d68b6f0ecbb",
      name: "Bank Fee",
      color: "#FD79A8",
    },
  ],
};

export const groupSlice = createSlice({
  name: SLICE_KEYS.GROUPS,
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<IGroup["name"]>) => {
      state.groups.push({
        id: generateUUID(),
        name: action.payload,
        color: getRandomWarmColor(),
      });
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload
      );
    },
    updateGroup: (state, action: PayloadAction<IGroup>) => {
      const index = state.groups.findIndex(
        (group) => group.id === action.payload.id
      );
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
    setGroups: (state, action: PayloadAction<IGroup[]>) => {
      state.groups = action.payload;
    },
  },
});

// Async thunk to delete group and clean up all related data
export const deleteGroupWithCleanup = createAsyncThunk(
  `${SLICE_KEYS.GROUPS}/deleteGroupWithCleanup`,
  async (groupId: string, { dispatch, getState }) => {
    // 1. Remove the group from all transactions
    dispatch(removeGroupFromAllTransactions(groupId));

    // 2. Delete all rules associated with this group
    dispatch(deleteRulesByGroupId(groupId));

    // 3. Delete the group itself
    dispatch(groupSlice.actions.deleteGroup(groupId));

    // 4. Re-apply all remaining active rules to ensure data consistency
    const state = getState() as IAppStore;
    const activeRules = getActiveRules(state);
    dispatch(reapplyAllRules(activeRules));

    return groupId;
  }
);

export const { addGroup, deleteGroup, setGroups, updateGroup } =
  groupSlice.actions;

export default groupSlice.reducer;
