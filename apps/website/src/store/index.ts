import { configureStore, combineReducers, Store } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { createPersistenceMiddleware } from "./middleware/persistenceMiddleware";

import { loadPersistedState } from "./storage/stateLoader";
import { SLICE_KEYS } from "./storage/config";

import groupSlice from "./slices/groupsSlice";
import filesSlice from "./slices/fileSlice";
import transactionSlice from "./slices/transactionsSlice";
import rulesSlice from "./slices/rulesSlice";
import { logger } from "./middleware/loggerMiddleware";

const persistedState = loadPersistedState();

const rootReducer = combineReducers({
  [SLICE_KEYS.FILES]: filesSlice,
  [SLICE_KEYS.GROUPS]: groupSlice,
  [SLICE_KEYS.TRANSACTIONS]: transactionSlice,
  [SLICE_KEYS.RULES]: rulesSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createPersistenceMiddleware(), logger),
});

export type IAppStore = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<IAppStore>();
export const useAppStore = useStore.withTypes<Store<IAppStore>>();
