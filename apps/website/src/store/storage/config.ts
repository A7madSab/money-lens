import { SLICE_KEYS } from "@money-lens/core/keys";
import type { StorageConfig } from "./types";

export const storageConfig: StorageConfig = {
  [SLICE_KEYS.FILES]: "local",
  [SLICE_KEYS.TRANSACTIONS]: "local",
  [SLICE_KEYS.RULES]: "local",
  [SLICE_KEYS.GROUPS]: "local",
};
