import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}
export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
}: Readonly<DropdownProps>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        ref.current &&
        e.target instanceof Node &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}>
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          tabIndex={0}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
              setOpen(false);
            }
          }}
          className={cn(
            "absolute z-40 mt-1.5 min-w-48 overflow-hidden rounded-xl border border-default bg-surface p-1.5 shadow-pop animate-scale-in",
            align === "right" ? "right-0" : "left-0",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  icon: LucideIcon;
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
  className?: string;
}
export function MenuItem({
  icon: Icon,
  children,
  onClick,
  danger,
  className,
}: Readonly<MenuItemProps>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors",
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-fg hover:bg-surface-2",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
}

export function MenuDivider() {
  return <div className="my-1.5 h-px bg-(--border)" />;
}
