import { StorageManager } from "./StorageManager";
import { storageConfig } from "./config";

export const loadPersistedState = () => {
  const persistedState: Record<string, unknown> = {};

  Object.entries(storageConfig).forEach(([sliceName, storageType]) => {
    const manager = new StorageManager({
      key: `redux_${sliceName}`,
      version: 1,
      storageType,
    });

    const sliceState = manager.load();
    if (sliceState) {
      persistedState[sliceName] = sliceState;
    }
  });

  return persistedState;
};
