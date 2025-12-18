//
// PUBLIC_INTERFACE
// A small error normalization and logging utility to ensure we never log "[object Object]".
// It formats errors, extracts key HTTP info, and emits consistent console output.
//
/** Convert any value to a concise string for logs without becoming "[object Object]". */
export function toSafeString(value, fallback = '') {
  if (value == null) return fallback || '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    try {
      return String(value);
    } catch {
      return fallback || '';
    }
  }
}

// PUBLIC_INTERFACE
export function normalizeAxiosError(error, requestConfig) {
  /** 
   * Normalize axios errors into a consistent shape:
   * { status, message, data, method, url, code }
   */
  const status = error?.response?.status || 0;
  const data = error?.response?.data;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'Unknown error';
  const method = (requestConfig?.method || error?.config?.method || 'GET').toUpperCase();
  const url = requestConfig?.url || error?.config?.url || '(unknown)';
  const code = error?.code || error?.response?.data?.code || undefined;

  return { status, message, data, method, url, code };
}

// PUBLIC_INTERFACE
export function logHttpError(prefix, normalized) {
  /**
   * Logs an HTTP error to the console with rich, structured information.
   * Ensures message parts are strings and readable.
   */
  try {
    const parts = [
      `[${prefix}] HTTP ${normalized.status || 0}`,
      normalized.method || '',
      normalized.url || '',
      `msg=${toSafeString(normalized.message, 'Unknown error')}`,
      normalized.code ? `code=${normalized.code}` : '',
    ].filter(Boolean);
    // Primary concise line
    // eslint-disable-next-line no-console
    console.error(parts.join(' '));

    // Secondary expanded context
    if (normalized.data) {
      // eslint-disable-next-line no-console
      console.error(`[${prefix}] response.data=`, normalized.data);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[${prefix}] Failed to log error`, e);
  }
}
