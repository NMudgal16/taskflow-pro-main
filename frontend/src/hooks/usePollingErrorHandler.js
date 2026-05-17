import { useCallback, useRef } from "react";
import toast from "react-hot-toast";

/**
 * Stable error handler for polling — avoids re-creating onError each render.
 * Throttles toasts so 429 storms do not spam the UI.
 */
export const usePollingErrorHandler = (label = "Could not refresh data") => {
  const lastToastRef = useRef(0);

  return useCallback((error) => {
    const message = error?.message || label;
    const isRateLimited = message.toLowerCase().includes("too many") || message.includes("429");

    if (isRateLimited) return;

    const now = Date.now();
    if (now - lastToastRef.current < 30000) return;
    lastToastRef.current = now;

    toast.error(message);
  }, [label]);
};

export default usePollingErrorHandler;
