import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "../../types/auth";
import { AUTH_STATUS, AuthContext, type AuthStatus } from "./auth-context";
import {
  api,
  refreshSession,
  setAccessToken,
  setOnAuthFailure,
} from "../../services/api";

const CHANNEL_NAME = "form-builder-auth";

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AUTH_STATUS.Loading);

  const applySession = useCallback((data: AuthResponse) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    setStatus(AUTH_STATUS.Authenticated);
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus(AUTH_STATUS.Unauthenticated);
  }, []);

  // 1. On page load, try to restore the session from the refresh cookie.
  //    refreshSession() dedupes, so StrictMode's double-run makes only one request.
  useEffect(() => {
    let cancelled = false;
    refreshSession()
      .then((data) => {
        if (!cancelled) applySession(data);
      })
      .catch(() => {
        if (!cancelled) clearSession();
      });
    return () => {
      cancelled = true;
    };
  }, [applySession, clearSession]);

  // 2. If a refresh fails later (session expired / revoked), log out locally.
  useEffect(() => {
    setOnAuthFailure(clearSession);
    return () => setOnAuthFailure(null);
  }, [clearSession]);

  // 3. Logging out in one tab logs out every open tab.
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data === "logout") clearSession();
    };
    return () => channel.close();
  }, [clearSession]);

  // Errors are re-thrown so the login/register form can show them.
  const login = useCallback(
    async (input: LoginInput) => {
      const { data } = await api.post<AuthResponse>("/auth/login", input, {
        skipAuthRefresh: true,
      });
      applySession(data);
      return data.user;
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const { data } = await api.post<AuthResponse>("/auth/register", input, {
        skipAuthRefresh: true,
      });
      applySession(data);
      return data.user;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", undefined, { skipAuthRefresh: true });
    } finally {
      // Clear locally even if the server call fails (e.g. offline).
      clearSession();
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.postMessage("logout");
        channel.close();
      }
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isLoading: status === AUTH_STATUS.Loading,
      status,
      isAuthenticated: status === AUTH_STATUS.Authenticated,
      login,
      register,
      logout,
    }),
    [user, status, login, register, logout],
  );
  return <AuthContext value={value}>{children}</AuthContext>;
}
