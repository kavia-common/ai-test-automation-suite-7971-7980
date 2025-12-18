import { useCallback, useState } from 'react';
import { toSafeString } from '../api/errorUtils';

// PUBLIC_INTERFACE
export function useApi(fn, deps = []) {
  /**
   * Wraps an async function and returns { call, data, error, loading, friendlyMessage }
   * Handles loading/error states and returns data.
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friendlyMessage, setFriendlyMessage] = useState('');
  const [data, setData] = useState(null);

  const call = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setFriendlyMessage('');
    try {
      const res = await fn(...args);
      setData(res);
      return res;
    } catch (e) {
      // e may be normalized by axios interceptor
      const msg = e?.message || 'Request failed';
      const status = e?.status;
      const url = e?.url;
      const detail = e?.data?.detail || e?.data?.error || '';
      const composed = [
        status ? `HTTP ${status}` : '',
        url ? `for ${url}` : '',
        msg ? `: ${toSafeString(msg)}` : '',
        detail ? ` (${toSafeString(detail)})` : '',
      ].filter(Boolean).join(' ');
      // eslint-disable-next-line no-console
      console.error('[useApi] request error', { status, url, message: msg, data: e?.data });
      setFriendlyMessage(composed || 'An unexpected error occurred.');
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { call, data, error, loading, setData, setError, friendlyMessage, setFriendlyMessage };
}
