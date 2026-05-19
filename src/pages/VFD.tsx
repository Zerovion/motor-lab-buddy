import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SimControls } from "@/components/SimControls";
import { SimCharts } from "@/components/SimCharts";
import { Metric } from "@/components/Metric";
import { MotorVisual } from "@/components/MotorVisual";
import { useSimulation } from "@/hooks/useSimulation";
import { vfStep, torqueSpeedCurve, type SimPoint } from "@/lib/motor";
import { useMotorConfig } from "@/contexts/MotorConfigContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function VFDPage() {
  const { config, ratedCurrent, ratedSpeed } = useMotorConfig();
  const [freq, setFreq] = useState(Math.round(config.frequency / 2));

  // Keep freq within [0, supply frequency] when config changes.
  useEffect(() => {
    setFreq((f) => Math.min(f, config.frequency));
  }, [config.frequency]);

  const step = useCallback(
    (t: number, prev?: SimPoint) => vfStep(t, freq, prev?.speed ?? 0, config),
    [freq, config],
  );
  const sim = useSimulation({ step, maxSeconds: 15 });
  const ts = useMemo(
    () => torqueSpeedCurve(freq / config.frequency, 1, 60, config),
    [freq, config],
  );

  const targetSpeed = Math.round((freq / config.frequency) * ratedSpeed);
  const vPerHz = config.voltage / config.frequency;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Module 04"
        title="V/F Control (Variable Frequency Drive)"
        subtitle="A VFD varies frequency and voltage proportionally (constant V/Hz) to control speed smoothly while maintaining rated torque. Modern, energy-efficient, and the basis of most industrial motor control."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <MotorVisual speed={sim.current.speed} running={sim.running} label={`${freq.toFixed(0)} Hz`} />
          <SimControls running={sim.running} onStart={sim.start} onStop={sim.stop} onReset={sim.reset} />
          <div className="rounded-xl border border-border bg-gradient-card p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Frequency</Label>
                <span className="font-display text-sm text-primary">{freq.toFixed(0)} Hz</span>
              </div>
              <Slider
                value={[freq]}
                onValueChange={(v) => setFreq(v[0])}
                min={0}
                max={config.frequency}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>V/Hz: {vPerHz.toFixed(2)}</span>
              <span>Target: {targetSpeed} RPM</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adjust frequency live during operation — the motor smoothly tracks the new speed setpoint.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 content-start">
          <Metric label="Current" value={sim.current.current} unit="A" max={ratedCurrent * 2} current={sim.current.current} />
          <Metric label="Speed" value={sim.current.speed} unit="RPM" max={ratedSpeed * 1.05} current={sim.current.speed} />
          <Metric label="Torque" value={sim.current.torque} unit="%" max={150} current={sim.current.torque} tone="success" />
          <Metric label="Frequency" value={freq} unit="Hz" />
          <Metric label="Voltage" value={Math.round((freq / config.frequency) * config.voltage)} unit="V" />
          <Metric label="Status" value={sim.running ? "RUNNING" : "IDLE"} />
        </div>
      </div>

      <SimCharts data={sim.data} torqueSpeed={ts} />
    </div>
  );
}
