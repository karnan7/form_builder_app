import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils.ts";

export function Spinner({ className }: Readonly<{ className?: string }>) {
  return (
    <Loader2 className={cn("h-5 w-5 animate-spin text-brand-500", className)} />
  );
}

export function PageLoader({
  label = "Loading...",
  fullScreen = false,
}: Readonly<{ label?: string; fullScreen?: boolean }>) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-24 text-muted ${fullScreen ? "min-h-screen" : "h-64"}`}
    >
      <Spinner className="h-7 w-7" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
