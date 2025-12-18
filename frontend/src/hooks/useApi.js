import { useCallback, useState } from 'react';

// PUBLIC_INTERFACE
export function useApi(fn, deps = []) {
  /**
   * Wraps an async function and returns { call, data, error, loading }
   * Handles loading/error states and returns data.
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const call = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      setData(res);
      return res;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { call, data, error, loading, setData, setError };
}
