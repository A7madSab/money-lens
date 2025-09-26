export type StorageType = "local" | "session";

export interface StorageConfig {
  [sliceName: string]: StorageType;
}

export interface StorageOptions {
  key: string;
  version?: number;
  storageType?: StorageType;
}
