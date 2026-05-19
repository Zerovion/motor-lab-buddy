import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  unit?: string;
  max?: number;
  current?: number;
  tone?: "primary" | "warning" | "success" | "destructive";
}

const toneClass: Record<string, string> = {
  primary: "from-primary to-accent",
  warning: "from-yellow-500 to-orange-500",
  success: "from-green-500 to-emerald-400",
  destructive: "from-red-500 to-rose-500",
};

export function Metric({ label, value, unit, max, current, tone = "primary" }: Props) {
  const pct = max && current !== undefined ? Math.min(100, (current / max) * 100) : null;
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        {unit && <span className="text-[10px] text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-1 font-display text-2xl font-bold text-foreground">
        {typeof value === "number" ? value.toFixed(1) : value}
      </div>
      {pct !== null && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-300", toneClass[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
