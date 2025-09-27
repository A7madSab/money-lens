export * from "@money-lens/core";
import { rootReducer, logger } from "@money-lens/core";
import { configureStore, Store } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { createPersistenceMiddleware } from "./middleware/persistenceMiddleware";
import { loadPersistedState } from "./storage/stateLoader";

const persistedState = loadPersistedState();

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
