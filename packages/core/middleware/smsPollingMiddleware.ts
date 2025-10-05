import { Middleware } from "@reduxjs/toolkit";
import {
  startPolling,
  stopPolling,
  setSmsMessages,
  setError,
  setLoading,
  ISms,
  ISmsState,
} from "../slices/smsSlice";

export interface IFilter {
  box?: "inbox" | "sent" | "draft" | "outbox" | "failed" | "queued" | "";
  minDate?: number;
  maxDate?: number;
  bodyRegex?: string;
  read?: number;
  _id?: number | null;
  thread_id?: number | null;
  address?: string;
  body?: string;
  indexFrom?: number;
  maxCount?: number;
}

export type GetInboxMessagesFn = (
  filter: Partial<IFilter>
) => Promise<ISms[] | null>;

/**
 * Creates SMS polling middleware with platform-specific SMS fetching function
 * @param getInboxMessages - Platform-specific function to fetch SMS messages
 * @param pollingInterval - Interval in milliseconds (default: 5000)
 */
export const createSmsPollingMiddleware = (
  getInboxMessages: GetInboxMessagesFn,
  pollingInterval = 5000
): Middleware => {
  let pollingIntervalId: NodeJS.Timeout | number | null = null;
  let lastKnownMessageId: number | null = null;

  const stopPollingInterval = () => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
    }
  };

  const convertFilterToNativeFormat = (
    filter: ISmsState["filter"]
  ): Partial<IFilter> => {
    const nativeFilter: Partial<IFilter> = {
      box: "inbox",
      indexFrom: 0,
    };

    if (filter.minDate) {
      nativeFilter.minDate = filter.minDate;
    }
    if (filter.maxDate) {
      nativeFilter.maxDate = filter.maxDate;
    }
    if (filter.maxCount) {
      nativeFilter.maxCount = filter.maxCount;
    }

    // If addresses provided, we'll filter in memory after fetching
    // Native SMS API doesn't support multiple address filtering directly
    return nativeFilter;
  };

  const poll = async (filter: ISmsState["filter"], dispatch: any) => {
    try {
      const nativeFilter = convertFilterToNativeFormat(filter);
      const messages = await getInboxMessages(nativeFilter);

      if (!messages || messages.length === 0) {
        dispatch(setSmsMessages([]));
        lastKnownMessageId = null;
        return;
      }

      // Filter by addresses if specified
      let filteredMessages = messages;
      if (filter.addresses && filter.addresses.length > 0) {
        filteredMessages = messages.filter((msg) =>
          filter.addresses!.some((addr) =>
            msg.address.toLowerCase().includes(addr.toLowerCase())
          )
        );
      }

      // Sort by date descending (newest first)
      filteredMessages.sort((a, b) => b.date - a.date);

      // Check if we have new messages
      const newestMessageId = filteredMessages[0]?._id ?? null;

      if (
        lastKnownMessageId === null ||
        newestMessageId !== lastKnownMessageId
      ) {
        dispatch(setSmsMessages(filteredMessages));
        dispatch(setLoading(false));
        lastKnownMessageId = newestMessageId;
      }
    } catch (error) {
      console.warn("SMS polling failed:", error);
      dispatch(
        setError(error instanceof Error ? error.message : "Failed to fetch SMS")
      );
    }
  };

  return (store) => (next) => (action) => {
    // Pass action to next middleware/reducer first
    const result = next(action);

    if (startPolling.match(action)) {
      // Stop any existing polling
      stopPollingInterval();

      // Reset last known message ID when starting fresh
      lastKnownMessageId = null;

      const filter = action.payload;
      const { dispatch } = store;

      // Initial poll
      poll(filter, dispatch);

      // Start polling interval
      pollingIntervalId = setInterval(() => {
        const state = store.getState();
        // Only continue polling if still enabled
        if (state.sms?.isPolling) {
          poll(filter, dispatch);
        } else {
          stopPollingInterval();
        }
      }, pollingInterval);
    }

    if (stopPolling.match(action)) {
      stopPollingInterval();
      lastKnownMessageId = null;
    }

    return result;
  };
};
