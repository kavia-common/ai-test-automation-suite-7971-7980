import axios from 'axios';

/**
 * Normalize a base URL string by trimming trailing slashes.
 */
function normalizeBase(url) {
  try {
    return url.replace(/\/+$/, '');
  } catch {
    return url;
  }
}

/**
 * Derive API base URL:
 * - REACT_APP_API_BASE or REACT_APP_BACKEND_URL if provided
 * - Otherwise derive from current origin by replacing port with 3001
 */
function deriveBaseUrl() {
  const envBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  if (envBase) return normalizeBase(envBase);
  try {
    const here = new URL(window.location.href);
    // Force :3001 while keeping protocol/host
    const derived = `${here.protocol}//${here.hostname}:3001`;
    return normalizeBase(derived);
  } catch {
    return 'http://localhost:3001';
  }
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the resolved API base URL used by the axios client. */
  return deriveBaseUrl();
}

/**
 * PUBLIC_INTERFACE
 * Returns the backend OpenAPI/Swagger docs URL if known. It prefers REACT_APP_BACKEND_DOCS_URL,
 * otherwise derives by appending '/docs' to the API base URL.
 */
export function getBackendDocsUrl() {
  /** Returns backend docs URL for convenience in the UI. */
  const explicit = process.env.REACT_APP_BACKEND_DOCS_URL;
  if (explicit) return explicit;
  const base = deriveBaseUrl();
  return `${base}/docs`;
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
  // If a full URL is given, use it directly; else join with base.
  let url = path;
  if (!/^https?:\/\//i.test(path)) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    url = normalizedPath;
  }
  try {
    const res = await api.get(url);
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: e };
  }
}

export default api;
