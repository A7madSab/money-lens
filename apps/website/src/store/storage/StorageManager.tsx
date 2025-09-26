import type { StorageOptions, StorageType } from "./types";

export class StorageManager {
  private readonly key: string;
  private readonly version: number;
  private readonly storageType: StorageType;

  constructor(options: StorageOptions) {
    this.key = options.key;
    this.version = options.version || 1;
    this.storageType = options.storageType || "local";
  }

  private get storage(): Storage | null {
    if (typeof window === "undefined") {
      return null;
    }
    return this.storageType === "local" ? localStorage : sessionStorage;
  }

  save(data: unknown): void {
    try {
      const serializedData = JSON.stringify({
        version: this.version,
        data,
      });
      this.storage?.setItem(this.key, serializedData);
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  load(): unknown {
    try {
      const serializedData = this.storage?.getItem(this.key);
      if (!serializedData) return null;

      const { version, data } = JSON.parse(serializedData);
      if (version !== this.version) {
        this.storage?.removeItem(this.key);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error loading from storage:", error);
      return null;
    }
  }

  clear(): void {
    this.storage?.removeItem(this.key);
  }
}
