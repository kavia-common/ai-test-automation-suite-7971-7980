import axios from 'axios';

/**
 * Derive API base URL:
 * - REACT_APP_API_BASE or REACT_APP_BACKEND_URL if provided
 * - Otherwise derive from current origin by replacing port with 3001
 */
function deriveBaseUrl() {
  const envBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  if (envBase) return envBase;
  try {
    const url = new URL(window.location.href);
    const port = '3001';
    url.port = port;
    return url.origin;
  } catch {
    return 'http://localhost:3001';
  }
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the resolved API base URL used by the axios client. */
  return deriveBaseUrl();
}

const api = axios.create({
  baseURL: deriveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptors for basic error normalization
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const normalized = {
      status: error?.response?.status || 0,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Unknown error',
      data: error?.response?.data,
    };
    return Promise.reject(normalized);
  }
);

// PUBLIC_INTERFACE
export async function healthCheck() {
  /**
   * Pings the backend using health path.
   * Uses REACT_APP_HEALTHCHECK_PATH or defaults to '/'
   */
  const path = process.env.REACT_APP_HEALTHCHECK_PATH || '/';
  const url = path.startsWith('/') ? path : `/${path}`;
  try {
    const res = await api.get(url);
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: e };
  }
}

export default api;
