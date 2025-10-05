export * from "@money-lens/core";
import {
  rootReducer,
  logger,
  createSmsPollingMiddleware,
} from "@money-lens/core";
import { configureStore, Store } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { getInboxMessages } from "../utils/sms";

const smsPollingMiddleware = createSmsPollingMiddleware(getInboxMessages, 5000);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(smsPollingMiddleware, logger),
});

export type IAppStore = ReturnType<typeof store.getState>;
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<IAppStore>();
export const useAppStore = useStore.withTypes<Store<IAppStore>>();
export default store;
