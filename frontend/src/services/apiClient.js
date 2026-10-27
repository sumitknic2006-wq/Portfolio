/**
 * Central Frontend API Client
 * 
 * Provides unified HTTP communication with the Express backend REST API (/api/v1).
 * Features:
 *  - Configurable base URL via import.meta.env.VITE_API_BASE_URL
 *  - Automated AbortController request timeouts
 *  - Standardized JSON parsing and robust error normalization
 *  - Protection against sensitive data leakage
 */

const DEFAULT_API_BASE_URL = 'http://localhost:5001/api/v1';

// Read API base URL, strip trailing slash, and automatically ensure /api/v1 suffix
const configuredUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
export const API_BASE_URL = configuredUrl.endsWith('/api/v1') 
  ? configuredUrl 
  : `${configuredUrl}/api/v1`;

export class ApiError extends Error {
  constructor(message, status = 500, code = 'API_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Perform an HTTP request with timeout and error handling
 */
async function request(endpoint, {
  method = 'GET',
  body = null,
  params = null,
  headers = {},
  timeout = 25000,
} = {}) {
  // 1. Build target URL with optional query parameters
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${cleanEndpoint}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // 2. Setup AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  const options = {
    method,
    headers: requestHeaders,
    signal: controller.signal,
    credentials: 'include',
  };

  if (body) {
    requestHeaders['Content-Type'] = 'application/json';
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    clearTimeout(timeoutId);

    // 3. Parse JSON or plain text
    const contentType = response.headers.get('content-type') || '';
    let responseData;
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { success: response.ok, message: text };
    }

    // 4. Handle non-2xx status codes
    if (!response.ok) {
      const errorMessage =
        responseData?.error?.message ||
        responseData?.message ||
        `Request failed with status ${response.status}`;
      const errorCode = responseData?.error?.code || 'HTTP_ERROR';
      const errorDetails = responseData?.error?.details || null;

      throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
    }

    // Return the response data (or .data if encapsulated)
    return responseData;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The server took too long to respond.',
        408,
        'REQUEST_TIMEOUT'
      );
    }

    // Network errors (e.g. backend offline, DNS failure)
    throw new ApiError(
      `Unable to connect to portfolio server (${err.message}). Please verify the backend is running at ${API_BASE_URL}.`,
      0,
      'NETWORK_ERROR'
    );
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
