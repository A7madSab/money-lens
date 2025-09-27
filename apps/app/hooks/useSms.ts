import { useEffect, useRef, useState } from "react";
import { getInboxMessages, IFilter, ISmsMessage } from "../utils/sms";

interface IProps {
  delay?: number;
  filter?: Partial<IFilter>;
}

export function useSms({ delay = 5000, filter = {} }: IProps = {}) {
  const [messages, setMessages] = useState<ISmsMessage[]>([]);
  const [latest, setLatest] = useState<ISmsMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const lastMessageIdRef = useRef<number | null>(null);
  const lastKnownMessageIdRef = useRef<number | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);
  const delayRef = useRef(delay);
  const filterRef = useRef(filter);

  // Update refs when props change
  delayRef.current = delay;
  filterRef.current = filter;

  useEffect(() => {
    console.log(
      "useEffect triggered - delay:",
      delay,
      "filter:",
      JSON.stringify(filter)
    );
    let polling: ReturnType<typeof setInterval>;
    let isCancelled = false;

    const poll = async () => {
      console.log("SMS polling at:", new Date().toLocaleTimeString());
      try {
        const inbox = (await getInboxMessages(filterRef.current)) || [];

        // Check if component was unmounted during async operation
        if (isCancelled) return;

        if (!inbox || inbox.length === 0) {
          setMessages([]);
          setLatest(null);
          lastKnownMessageIdRef.current = null;
        } else {
          // Check if we have new messages by comparing the last message ID
          const lastInboxMessageId = inbox[inbox.length - 1]._id;
          const hasNewMessages = lastKnownMessageIdRef.current !== lastInboxMessageId;

          if (hasNewMessages) {
            setMessages(inbox);
            lastKnownMessageIdRef.current = lastInboxMessageId;
          }

          const newest = inbox[0];
          if (
            lastMessageIdRef.current === null ||
            newest._id !== lastMessageIdRef.current
          ) {
            lastMessageIdRef.current = newest._id;
            setLatest(newest);
          }
        }
        setError(null);
      } catch (err) {
        if (!isCancelled) {
          console.warn("SMS polling failed:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!isCancelled && isInitialLoadRef.current) {
          setLoading(false);
          isInitialLoadRef.current = false;
        }
      }
    };

    // Only show loading on true initial load (component mount)
    if (isInitialLoadRef.current) {
      setLoading(true);
    }

    // Reset refs when filter changes
    lastMessageIdRef.current = null;

    poll(); // run immediately
    polling = setInterval(poll, delayRef.current);

    return () => {
      console.log("useEffect cleanup triggered");
      isCancelled = true;
      clearInterval(polling);
    };
  }, []);

  return [messages, latest, loading, error] as const;
}
