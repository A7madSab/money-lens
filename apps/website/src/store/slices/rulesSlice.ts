import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SLICE_KEYS } from "../storage/config";
import { generateUUID } from "@/utils";
import { reapplyAllRules } from "./transactionsSlice";
import { IAppStore } from "..";

export interface IRule {
  id: string;
  name: string;
  contains: string;
  groupId: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateRulePayload {
  name: string;
  contains: string;
  groupId: string;
}

const initialState: { rules: IRule[] } = {
  rules: [
    {
      id: "Petrol",
      name: "Petrol",
      contains: "CHILLOUT, MOTAHEDA, CHILL OUT, MISR PETROLEUM ",
      groupId: "3",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "food",
      name: "Food",
      contains:
        "Brioche, Cilantro, CREPE, CAIZO, talabat, STACK, CHICKIN WOR, SECOND CU, NOLA, CIRCL, AGHA, Wimp, BAZOOKA, ELABD, Suez Pastry SUE, COASTA, TSEPPAS, CREPE WAFFLE TAGMOA, HOLMES BURGER, Coffee Zone ",
      groupId: "1",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "transportation",
      name: "Transportation",
      contains: "Uber",
      groupId: "2",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      name: "E Subscriptions",
      contains:
        "Netflix, CANVA, CLAUDE, Google One Mountain, APPLE.COM BILL ITUNES.COM",
      groupId: "fda79c30-e7e1-4d0a-a6c0-e13c5c4eb62c",
      id: "e5e0e4c5-39f9-4768-80fd-96d7395f2f46",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      name: "Food",
      contains:
        "Brioche, Cilantro, CREPE, CAIZO, talabat, STACK, CHICKIN WOR, SECOND CU, NOLA, CIRCL, AGHA, Wimp, BAZOOKA, ELABD, Suez Pastry SUE, COASTA, TSEPPAS, CREPE WAFFLE TAGMOA, HOLMES BURGER, Coffee Zone, D  S, UNCLE SAMIR",
      groupId: "1",
      id: "3dff90ff-9d6d-4cab-acc9-acd3826e3616",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      name: "Utilities",
      contains: "BILL ETISALAT, BTECH",
      groupId: "37185064-492f-46f3-813d-1f0cbcb995ec",
      id: "53378f98-d61e-4e89-a465-bc313111e3c2",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      name: "Cloth",
      contains: "LC WAIKIKI, DECATHLON, Thebasiclook",
      groupId: "8",
      id: "34dd439b-a7ae-43ba-87ce-426e7bcf5ac3",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      name: "Food",
      contains:
        "Brioche, Cilantro, CREPE, CAIZO, talabat, STACK, CHICKIN WOR, SECOND CU, NOLA, CIRCL, AGHA, Wimp, BAZOOKA, ELABD, Suez Pastry SUE, COASTA, TSEPPAS, CREPE WAFFLE TAGMOA, HOLMES BURGER, Coffee Zone, D  S, UNCLE SAMIR, MASTER",
      groupId: "1",
      id: "9748ad54-1f9f-48b0-8182-26c52550f71f",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      name: "Entertainment",
      contains: "CINEMA, CITYSTARS",
      groupId: "5",
      id: "d52ee5f7-e54a-4baf-8e5c-0fc328a7004b",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      name: "Bank Fee",
      contains: "INSURANCE FEE, LOAD WALLET FEES, FOREIGN EXCHANGE FEES",
      groupId: "89e0b546-9e56-4c7a-b34b-6d68b6f0ecbb",
      id: "c52dd8df-d5ad-403f-86a6-a2d38a75dc8a",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
};

export const rulesSlice = createSlice({
  name: SLICE_KEYS.RULES,
  initialState,
  reducers: {
    addRule: (state, action: PayloadAction<CreateRulePayload>) => {
      const newRule: IRule = {
        ...action.payload,
        id: generateUUID(),
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      state.rules.push(newRule);
    },
    deleteRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter((rule) => rule.id !== action.payload);
    },
    updateRule: (state, action: PayloadAction<IRule>) => {
      const index = state.rules.findIndex(
        (rule) => rule.id === action.payload.id
      );
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
    },
    setRules: (state, action: PayloadAction<IRule[]>) => {
      state.rules = action.payload;
    },
    toggleRuleActive: (state, action: PayloadAction<string>) => {
      const rule = state.rules.find((rule) => rule.id === action.payload);
      if (rule) {
        rule.isActive = !rule.isActive;
      }
    },
    deleteRulesByGroupId: (state, action: PayloadAction<string>) => {
      // Remove all rules that are associated with the specified groupId
      state.rules = state.rules.filter(
        (rule) => rule.groupId !== action.payload
      );
    },
  },
  selectors: {
    getActiveRules: (state) => state.rules.filter((rule) => rule.isActive),
  },
});

// Async thunk to add rule and re-apply all rules
export const addRuleWithReapply = createAsyncThunk(
  `${SLICE_KEYS.RULES}/addRuleWithReapply`,
  async (rulePayload: CreateRulePayload, { dispatch, getState }) => {
    // Add the rule
    dispatch(rulesSlice.actions.addRule(rulePayload));

    // Get updated state and re-apply all active rules
    const state = getState() as IAppStore;
    const activeRules = getActiveRules(state);
    dispatch(reapplyAllRules(activeRules));

    return rulePayload;
  }
);

// Async thunk to update rule and re-apply all rules
export const updateRuleWithReapply = createAsyncThunk(
  `${SLICE_KEYS.RULES}/updateRuleWithReapply`,
  async (rule: IRule, { dispatch, getState }) => {
    // Update the rule
    dispatch(rulesSlice.actions.updateRule(rule));

    // Get updated state and re-apply all active rules
    const state = getState() as IAppStore;
    const activeRules = getActiveRules(state);
    dispatch(reapplyAllRules(activeRules));

    return rule;
  }
);

// Async thunk to toggle rule and re-apply all rules
export const toggleRuleActiveWithReapply = createAsyncThunk(
  `${SLICE_KEYS.RULES}/toggleRuleActiveWithReapply`,
  async (ruleId: string, { dispatch, getState }) => {
    // Toggle the rule
    dispatch(rulesSlice.actions.toggleRuleActive(ruleId));

    // Get updated state and re-apply all active rules
    const state = getState() as IAppStore;
    const activeRules = getActiveRules(state);
    dispatch(reapplyAllRules(activeRules));

    return ruleId;
  }
);

export const {
  addRule,
  deleteRule,
  updateRule,
  setRules,
  toggleRuleActive,
  deleteRulesByGroupId,
} = rulesSlice.actions;

export const { getActiveRules } = rulesSlice.selectors;

export default rulesSlice.reducer;
