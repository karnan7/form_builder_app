import { createContext } from "react";

export type Theme = "light" | "dark" | "system";

/** What is actually shown on screen ("system" resolved to light or dark). */
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// null default lets useTheme() detect when it's used outside the provider.
export const ThemeContext = createContext<ThemeContextValue | null>(null);
