import { type ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { CardDecor, type CardDecorProps } from "./CardDecor";
import { cn } from "../../lib/utils";

export interface NavCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  hero?: boolean;
  accent?: string;
  decor?: CardDecorProps["variant"];
  badge?: ReactNode;
  className?: string;
}

const NavCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  hero = false,
  accent = "#bfa23a",
  decor = "a",
  badge,
  className,
}: NavCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex aspect-4/3 flex-col overflow-hidden rounded-3xl p-6 text-left transition-all duration-200 hover:-translate-y-1",
        hero
          ? "bg-brand-gradient text-white shadow-card hover:shadow-pop"
          : "border border-default bg-surface shadow-soft hover:shadow-card",
        className,
      )}
    >
      {/* Corner decoration */}
      <div className="pointer-events-none absolute bottom-0 right-0 opacity-90">
        <CardDecor variant={hero ? "hero" : decor} color={accent} />
      </div>

      {/* Top-right line icon */}
      {Icon && (
        <div className="relative ml-auto">
          <Icon
            className={cn("h-7 w-7", hero && "text-white/90")}
            style={!hero ? { color: accent } : undefined}
            strokeWidth={1.6}
          />
        </div>
      )}

      {/* Title + description */}
      <div className="relative mt-auto max-w-[78%]">
        <h3
          className={cn(
            "text-xl font-bold tracking-tight",
            hero ? "text-white" : "text-fg",
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "mt-1 text-sm leading-snug",
              hero ? "text-white/80" : "text-muted",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Arrow + optional badge */}
      <div className="relative mt-4 flex items-center gap-3">
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:translate-x-1",
            hero ? "bg-white/15 text-white" : "bg-surface-2 text-fg",
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
        {badge != null && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              hero ? "bg-white/15 text-white" : "bg-surface-2 text-muted",
            )}
          >
            {badge}
          </span>
        )}
      </div>
    </button>
  );
};

export default NavCard;
