import { useEffect, useRef } from "react";
import { WS_URL } from "../api.js";

/**
 * Connects to the backend's WebSocket server and calls onMessage
 * whenever a task_created / task_updated / task_deleted event arrives.
 */
export function useTaskSocket(onMessage) {
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type && data.type !== "connected") {
          callbackRef.current?.(data);
        }
      } catch {
        // Ignore malformed messages.
      }
    };

    return () => ws.close();
  }, []);
}
