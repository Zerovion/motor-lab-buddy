import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SimControls } from "@/components/SimControls";
import { SimCharts } from "@/components/SimCharts";
import { Metric } from "@/components/Metric";
import { MotorVisual } from "@/components/MotorVisual";
import { useSimulation } from "@/hooks/useSimulation";
import { autoTransformerStep, torqueSpeedCurve } from "@/lib/motor";
import { useMotorConfig } from "@/contexts/MotorConfigContext";
import { Button } from "@/components/ui/button";

const TAPS = [0.5, 0.65, 0.8];

export default function AutoTransformerPage() {
  const { config, ratedCurrent, ratedSpeed } = useMotorConfig();
  const [tap, setTap] = useState(0.65);
  const step = useCallback((t: number) => autoTransformerStep(t, tap, config), [tap, config]);
  const sim = useSimulation({ step, maxSeconds: 6 });
  const ts = useMemo(() => torqueSpeedCurve(tap, 1, 60, config), [tap, config]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Module 03"
        title="Autotransformer Starter"
        subtitle="An autotransformer reduces the voltage applied to the motor during starting via tap selection. Current scales with tap ratio (k) while torque scales with k², making it gentler than DOL but with reduced starting torque."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <MotorVisual speed={sim.current.speed} running={sim.running} label={`TAP ${Math.round(tap * 100)}%`} />
          <SimControls running={sim.running} onStart={sim.start} onStop={sim.stop} onReset={sim.reset} />
          <div className="rounded-xl border border-border bg-gradient-card p-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Voltage Tap</div>
            <div className="flex gap-2">
              {TAPS.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={tap === t ? "default" : "outline"}
                  onClick={() => { sim.reset(); setTap(t); }}
                  className={tap === t ? "bg-gradient-primary text-primary-foreground" : ""}
                >
                  {Math.round(t * 100)}%
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lower taps → softer start, but starting torque drops with the square of voltage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 content-start">
          <Metric label="Current" value={sim.current.current} unit="A" max={ratedCurrent * 8} current={sim.current.current} tone="warning" />
          <Metric label="Speed" value={sim.current.speed} unit="RPM" max={ratedSpeed * 1.05} current={sim.current.speed} />
          <Metric label="Torque" value={sim.current.torque} unit="%" max={200} current={sim.current.torque} tone="success" />
          <Metric label="Tap" value={`${Math.round(tap * 100)}%`} />
          <Metric label="Torque Ratio" value={`${(tap * tap).toFixed(2)}×`} />
          <Metric label="Status" value={sim.running ? "RUNNING" : "IDLE"} />
        </div>
      </div>

      <SimCharts data={sim.data} torqueSpeed={ts} />
    </div>
  );
}
