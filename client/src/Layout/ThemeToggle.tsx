import { Sun, Moon, Laptop, type LucideIcon } from "lucide-react";
import { useTheme, type Theme } from "../context/theme";

const OPTIONS: { value: Theme; label: string; Icon: LucideIcon }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Laptop },
];

type ThemeToggleProps = {
  variant?: "icon" | "segmented";
};

export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  return variant === "segmented" ? <ThemeSegmented /> : <ThemeIconButton />;
}

function ThemeIconButton() {
  const { theme, setTheme } = useTheme();

  const index = Math.max(
    0,
    OPTIONS.findIndex((o) => o.value === theme),
  );
  const current = OPTIONS[index];
  const next = OPTIONS[(index + 1) % OPTIONS.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next.value)}
      aria-label={`Theme: ${current.label}. Switch to ${next.label}`}
      title={`Theme: ${current.label}`}
      className="grid h-11 w-11 place-items-center rounded-2xl border border-default bg-surface text-muted shadow-soft transition-all hover:border-brand-300 hover:text-fg"
    >
      <current.Icon className="h-5 w-5" />
    </button>
  );
}

function ThemeSegmented() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex rounded-lg border border-gray-300 p-1 dark:border-gray-700"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors ${
              active
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
