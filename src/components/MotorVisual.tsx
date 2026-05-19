import { cn } from "@/lib/utils";

interface Props {
  speed: number; // RPM
  running: boolean;
  label?: string;
}

export function MotorVisual({ speed, running, label = "MOTOR" }: Props) {
  // Convert RPM to animation duration (faster = shorter)
  const duration = speed > 10 ? Math.max(0.3, 60 / speed) : 0;
  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-card border border-border">
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
        <div className="absolute inset-2 rounded-full border-2 border-primary/40" />
        <div
          className={cn(
            "absolute inset-4 rounded-full border-4 border-dashed border-primary",
            running && "shadow-[var(--glow-strong)]",
          )}
          style={{
            animation: duration > 0 ? `spin-slow ${duration}s linear infinite` : "none",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-primary text-glow">
              {Math.round(speed)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">RPM</div>
          </div>
        </div>
      </div>
      <div className="mt-3 font-display text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
