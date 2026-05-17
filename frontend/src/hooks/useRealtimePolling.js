import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_INTERVAL_MS = 15000;

/**
 * Polls a fetch function on an interval. Uses refs for callbacks so the interval
 * is not reset on every parent re-render (which caused request storms + 429s).
 */
export const useRealtimePolling = (fetchFn, options = {}) => {
  const {
    intervalMs = DEFAULT_INTERVAL_MS,
    enabled = true,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRef = useRef(fetchFn);
  const onErrorRef = useRef(onError);
  const inFlightRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    fetchRef.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const runFetch = useCallback(async (isInitial = false) => {
    if (!enabled || inFlightRef.current) return;

    inFlightRef.current = true;

    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const result = await fetchRef.current();
      if (!isMountedRef.current) return;
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      if (!isMountedRef.current) return;
      if (onErrorRef.current) onErrorRef.current(error);
    } finally {
      inFlightRef.current = false;
      if (!isMountedRef.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  }, [enabled]);

  const refresh = useCallback(() => runFetch(false), [runFetch]);

  useEffect(() => {
    if (!enabled) return undefined;

    runFetch(true);
    const id = setInterval(() => runFetch(false), intervalMs);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        runFetch(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, intervalMs, runFetch]);

  return { data, loading, refreshing, lastUpdated, refresh };
};

export default useRealtimePolling;
