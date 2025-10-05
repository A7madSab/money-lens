import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IParsedSms, ISms } from "./types";
import { SLICE_KEYS } from "../../keys";
import { smsParserRegistry } from "./utilities";

export interface ISmsState {
  messages: IParsedSms[];
  lastMessageId: number | null;
  loading: boolean;
  error: string | null;
  isPolling: boolean;
  filter: {
    addresses?: string[];
    minDate?: number;
    maxDate?: number;
    maxCount?: number;
  };
}

const initialState: ISmsState = {
  messages: [],
  lastMessageId: null,
  loading: false,
  error: null,
  isPolling: false,
  filter: {},
};

const smsSlice = createSlice({
  name: SLICE_KEYS.SMS,
  initialState,
  reducers: {
    setSmsMessages: (state, action: PayloadAction<ISms[]>) => {
      // Automatically parse messages into structured transactions
      state.messages = action.payload.map((msg) =>
        smsParserRegistry.parse(msg),
      );
      state.error = null;

      // Update lastMessageId to the most recent message
      if (action.payload.length > 0 && action.payload[0]) {
        // Messages are sorted by date descending, so first message is newest
        state.lastMessageId = action.payload[0]._id;
      } else {
        state.lastMessageId = null;
      }
    },
    setLastMessageId: (state, action: PayloadAction<number | null>) => {
      state.lastMessageId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    startPolling: (state, action: PayloadAction<ISmsState["filter"]>) => {
      state.isPolling = true;
      state.filter = action.payload;
      state.loading = true;
      state.error = null;
    },
    stopPolling: (state) => {
      state.isPolling = false;
      state.loading = false;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.lastMessageId = null;
      state.error = null;
    },
  },
});

export const {
  setSmsMessages,
  setLastMessageId,
  setLoading,
  setError,
  startPolling,
  stopPolling,
  clearMessages,
} = smsSlice.actions;

export * from "./types";
export * from "./utilities";
export default smsSlice.reducer;
