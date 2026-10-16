import axios, { type AxiosError } from "axios";
import type { AuthResponse } from "../types/auth";

// Extra per-request flags used by the refresh logic below.
declare module "axios" {
  interface AxiosRequestConfig {
    /** Don't try to refresh the token if this request returns 401 (login, refresh, logout). */
    skipAuthRefresh?: boolean;
    /** Internal: marks a request that has already been retried once. */
    _retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  withCredentials: true, // send the httpOnly refresh-token cookie
  timeout: 15_000,
});

// ---- Access token: kept in memory only, never in localStorage (XSS-safe) ----
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

// ---- Lets AuthProvider react when the session dies mid-use ----
let onAuthFailure: (() => void) | null = null;

export function setOnAuthFailure(callback: (() => void) | null) {
  onAuthFailure = callback;
}

// ---- Refresh: if several requests 401 at once, they all share ONE refresh call ----
let refreshPromise: Promise<AuthResponse> | null = null;

export function refreshSession(): Promise<AuthResponse> {
  refreshPromise ??= api
    .post<AuthResponse>("/auth/refresh", undefined, { skipAuthRefresh: true })
    .then((response) => {
      setAccessToken(response.data.accessToken);
      return response.data;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

// Attach the access token to every request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// On 401: refresh once, then replay the original request with the new token.
api.interceptors.response.use(
  (response) => response, // ✅ Normal success: If the request succeeds, just return the response.

  // ❌ On error:
  async (error: AxiosError) => {
    const original = error.config;

    const shouldRefresh =
      error.response?.status === 401 &&
      original && // - request exists
      !original._retry && // - not already retried
      !original.skipAuthRefresh; // - not marked skipAuthRefresh

    if (!shouldRefresh) {
      // 🚫 If not eligible for refresh, just throw the error.
      throw error;
    }

    original._retry = true; // 🔄 Mark this request as already retried once.

    try {
      await refreshSession(); // 🔑 Attempt to refresh the session.

      return await api(original); // 🔁 If refresh succeeds, replay the original request with new token.
    } catch (refreshError) {
      // 🧹 If refresh fails:
      // - clear the token
      setAccessToken(null);

      onAuthFailure?.(); // - trigger the registered failure callback. it will clear local context state
      throw refreshError;
    }
  },
);
