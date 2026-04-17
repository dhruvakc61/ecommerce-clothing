import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";

export default function useFetch(url, immediate = true) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(!!(immediate && url));
  const [error,   setError]   = useState(null);

  // Keep a ref to the latest url so the async callback never closes over a stale value
  const urlRef = useRef(url);
  useEffect(() => { urlRef.current = url; }, [url]);

  const fetchNow = useCallback(async (overrideUrl) => {
    const target = overrideUrl ?? urlRef.current;
    if (!target) { setLoading(false); return; }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(target);
      // Only update state if the url hasn't changed while we were waiting
      if (target === urlRef.current || overrideUrl) {
        setData(res.data);
      }
    } catch (err) {
      if (target === urlRef.current || overrideUrl) {
        setError(err.response?.data?.message || "Error loading data");
      }
    } finally {
      if (target === urlRef.current || overrideUrl) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      // Reset data when url changes so stale data doesn't flash
      setData(null);
      setError(null);
      fetchNow(url);
    }
  }, [url, immediate, fetchNow]);

  return { data, loading, error, refetch: fetchNow };
}