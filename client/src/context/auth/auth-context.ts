import { createContext } from "react";
import type { LoginInput, RegisterInput, User } from "../../types/auth";

export const AUTH_STATUS = {
  Loading: "loading",
  Authenticated: "authenticated",
  Unauthenticated: "unauthenticated",
} as const;

/** "loading" | "authenticated" | "unauthenticated", derived from the object above */
export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
