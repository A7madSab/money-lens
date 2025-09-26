import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { SLICE_KEYS } from "../storage/config";
import { parseCSVWithRules } from "@/utils";
import {
  ITransaction,
  addTransactions,
  removeTransactionsByFileName,
} from "./transactionsSlice";
import { getActiveRules } from "./rulesSlice";
import { IAppStore } from "..";

export interface IFileUploadProgress {
  name: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export interface IFileState {
  files: IFileUploadProgress[];
  loading: boolean;
  error: string | null;
}

const initialState: IFileState = {
  files: [],
  loading: false,
  error: null,
};

export const filesSlice = createSlice({
  name: SLICE_KEYS.FILES,
  initialState,
  reducers: {
    startedUplaodingFiles: (state) => {
      state.loading = true;
      state.error = null;
    },
    errorUplaodingFiles: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFileProgress: (
      state,
      action: PayloadAction<{
        fileName: File["name"];
        progress: IFileUploadProgress["progress"];
        status: IFileUploadProgress["status"];
      }>
    ) => {
      const { fileName, progress, status } = action.payload;
      const fileProgress = state.files.map((f) => {
        if (f.name !== fileName) {
          return f;
        }

        return {
          name: f.name,
          progress,
          status,
        };
      });

      state.files = fileProgress;
      state.loading = false;
      state.error = "";
    },
    setFileProgresses(state, action: PayloadAction<IFileUploadProgress[]>) {
      state.files = action.payload;
    },
    removeFile: (state, action: PayloadAction<string>) => {
      // Remove the file from the files array
      state.files = state.files.filter((file) => file.name !== action.payload);
    },
  },
});

export const {
  startedUplaodingFiles,
  errorUplaodingFiles,
  setFileProgresses,
  setFileProgress,
  removeFile,
} = filesSlice.actions;

export const processFiles = createAsyncThunk(
  `${SLICE_KEYS.FILES}/processFiles`,
  async (files: File[], { dispatch, getState }): Promise<void> => {
    const csvFiles = files.filter((file) => file.type === "text/csv");

    if (csvFiles.length === 0) {
      dispatch(errorUplaodingFiles("No CSV files uploaded"));
      return;
    }

    dispatch(startedUplaodingFiles());

    // Get active rules from the store
    const state = getState() as IAppStore;
    const activeRules = getActiveRules(state);

    const initialProgresses: IFileUploadProgress[] = files.map((file) => ({
      name: file.name,
      progress: 0,
      status: "uploading" as const,
    }));
    dispatch(setFileProgresses(initialProgresses));

    const allData: ITransaction[] = [];

    for (const file of files) {
      try {
        const data = await Promise.resolve(
          parseCSVWithRules(file, activeRules)
        );

        dispatch(
          setFileProgress({
            fileName: file.name,
            progress: 50,
            status: "uploading",
          })
        );
        allData.push(...data);
        dispatch(
          setFileProgress({
            fileName: file.name,
            progress: 100,
            status: "completed",
          })
        );
      } catch {
        dispatch(
          setFileProgress({ fileName: file.name, progress: 0, status: "error" })
        );
      }
    }

    dispatch(addTransactions(allData));
  }
);

export const removeFileAndTransactions = createAsyncThunk(
  `${SLICE_KEYS.FILES}/removeFileAndTransactions`,
  async (fileName: string, { dispatch }): Promise<void> => {
    // Remove the file from the files list
    dispatch(removeFile(fileName));

    // Remove all transactions associated with this file
    dispatch(removeTransactionsByFileName(fileName));
  }
);

export default filesSlice.reducer;
