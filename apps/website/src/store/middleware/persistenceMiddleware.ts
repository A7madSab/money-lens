import type { Middleware } from "@reduxjs/toolkit";
import { StorageManager } from "../storage/StorageManager";
import { storageConfig } from "../storage/config";

export const createPersistenceMiddleware = (): Middleware => {
  const storageManagers = new Map<string, StorageManager>();

  // Initialize storage managers for each slice
  Object.entries(storageConfig).forEach(([sliceName, storageType]) => {
    storageManagers.set(
      sliceName,
      new StorageManager({
        key: `redux_${sliceName}`,
        version: 1,
        storageType,
      })
    );
  });

  return (store) => (next) => (action) => {
    const result = next(action);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const actionType = action?.type;

    if (typeof actionType === "string") {
      const sliceName = actionType.split("/")[0];

      if (storageManagers.has(sliceName)) {
        const state = store.getState();
        const manager = storageManagers.get(sliceName);

        if (manager && state[sliceName]) {
          console.log(
            `Persisting slice: ${sliceName} for action: ${actionType}`
          );
          manager.save(state[sliceName]);
        }
      }
    }

    return result;
  };
};
