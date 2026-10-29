/**
 * Decorative corner motif for dashboard cards: concentric stroked circles
 * centred on the bottom-right corner of the SVG. The SVG clips everything
 * outside its viewBox, so only the quarter-fan inside the box is visible.
 */

const SIZE = 170;

type Variant = "a" | "b" | "c" | "d" | "e" | "hero";

interface Shape {
  bands: number;
  max: number;
  base?: number;
  min?: number;
}

const SHAPES: Record<Variant, Shape> = {
  a: { bands: 5, max: 116 },
  b: { bands: 6, max: 128 },
  c: { bands: 4, max: 104 },
  d: { bands: 5, max: 120 },
  e: { bands: 7, max: 132 },
  hero: { bands: 6, max: 124, base: 0.22, min: 0.05 },
};

export interface CardDecorProps {
  variant?: Variant;
  color?: string;
  className?: string;
}

export function CardDecor({
  variant = "a",
  color = "#bfa23a",
  className,
}: Readonly<CardDecorProps>) {
  const { bands, max, base = 0.85, min = 0.3 } = SHAPES[variant] ?? SHAPES.a;
  const step = max / bands;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      fill="none"
      stroke={variant === "hero" ? "#ffffff" : color}
      aria-hidden="true"
    >
      {Array.from({ length: bands }, (_, i) => {
        // Strong inner band -> soft outer edge.
        const t = bands > 1 ? i / (bands - 1) : 0;
        return (
          <circle
            key={i}
            cx={SIZE}
            cy={SIZE}
            r={step * (i + 0.5)}
            strokeWidth={step}
            opacity={base - t * (base - min)}
          />
        );
      })}
    </svg>
  );
}
