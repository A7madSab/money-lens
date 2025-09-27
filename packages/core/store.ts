import { combineReducers, configureStore } from "@reduxjs/toolkit";
import groupSlice from "./slices/groupsSlice";
import filesSlice from "./slices/fileSlice";
import transactionSlice from "./slices/transactionsSlice";
import rulesSlice from "./slices/rulesSlice";
import { SLICE_KEYS } from "./keys";

export const rootReducer = combineReducers({
  [SLICE_KEYS.FILES]: filesSlice,
  [SLICE_KEYS.GROUPS]: groupSlice,
  [SLICE_KEYS.TRANSACTIONS]: transactionSlice,
  [SLICE_KEYS.RULES]: rulesSlice,
});

// these are just to get the types for redux
const store = configureStore({
  reducer: rootReducer,
});

export type IAppStore = ReturnType<typeof store.getState>;
