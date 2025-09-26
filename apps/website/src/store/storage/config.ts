import type { StorageConfig } from "./types";

export enum SLICE_KEYS {
  GROUPS = "groups",
  TRANSACTIONS = "transactions",
  RULES = "rules",
  FILES = "files",
}

export const storageConfig: StorageConfig = {
  [SLICE_KEYS.FILES]: "local",
  [SLICE_KEYS.TRANSACTIONS]: "local",
  [SLICE_KEYS.RULES]: "local",
  [SLICE_KEYS.GROUPS]: "local",
};
