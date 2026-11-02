import type { HTMLAttributes, ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

/** Pulsing placeholder block. Size and shape come from `className`. */
export function Skeleton({
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-surface-2", className)}
      {...props}
    />
  );
}

interface SpinnerProps {
  className?: string;
}

/** Small animated loading icon. Decorative: pair it with visible or screen-reader text. */
export function Spinner({ className }: Readonly<SpinnerProps>) {
  return (
    <Loader2
      aria-hidden="true"
      className={cn("h-5 w-5 animate-spin text-brand-500", className)}
    />
  );
}

interface PageLoaderProps {
  label?: string;
  /** Fill the whole viewport (route fallback) instead of a fixed-height block. */
  fullScreen?: boolean;
}

/** Centered loading state for a page or a large section. */
export function PageLoader({
  label = "Loading…",
  fullScreen = false,
}: Readonly<PageLoaderProps>) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted",
        fullScreen ? "min-h-screen" : "h-64",
      )}
    >
      <Spinner className="h-7 w-7" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Optional call to action, such as a button or a group of buttons. */
  action?: ReactNode;
  className?: string;
}

/** Centered message for lists or pages with nothing to show. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: Readonly<EmptyStateProps>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-default px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-muted">
          <Icon className="h-6 w-6" strokeWidth={1.6} />
        </div>
      )}
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
