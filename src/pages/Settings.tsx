import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMotorConfig } from "@/contexts/MotorConfigContext";
import { Metric } from "@/components/Metric";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

const POLE_OPTIONS = [2, 4, 6, 8, 10, 12];

export default function SettingsPage() {
  const { config, updateConfig, reset, ratedCurrent, ratedSpeed, syncSpeed } = useMotorConfig();

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Settings"
        title="Motor Configuration"
        subtitle="Configure the rated nameplate parameters of the simulated 3-phase induction motor. These settings apply globally to every simulation module and persist across sessions."
      />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-gradient-card p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Rated Power
              </Label>
              <span className="font-display text-sm text-primary">
                {config.ratedPowerKW.toFixed(1)} kW
              </span>
            </div>
            <Slider
              value={[config.ratedPowerKW]}
              onValueChange={(v) => updateConfig({ ratedPowerKW: v[0] })}
              min={0.5}
              max={250}
              step={0.5}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0.5 kW</span>
              <span>250 kW</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voltage" className="text-xs uppercase tracking-widest text-muted-foreground">
              Rated Voltage (line-to-line)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="voltage"
                type="number"
                min={100}
                max={11000}
                step={10}
                value={config.voltage}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v) && v > 0) updateConfig({ voltage: v });
                }}
                className="max-w-32"
              />
              <span className="text-xs text-muted-foreground">Volts</span>
              <div className="ml-auto flex gap-1">
                {[230, 400, 415, 690].map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={config.voltage === v ? "default" : "outline"}
                    onClick={() => updateConfig({ voltage: v })}
                    className={config.voltage === v ? "bg-gradient-primary text-primary-foreground" : ""}
                  >
                    {v}V
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Supply Frequency
              </Label>
              <div className="flex gap-2">
                {[50, 60].map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={config.frequency === f ? "default" : "outline"}
                    onClick={() => updateConfig({ frequency: f })}
                    className={config.frequency === f ? "bg-gradient-primary text-primary-foreground flex-1" : "flex-1"}
                  >
                    {f} Hz
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Pole Count
              </Label>
              <Select
                value={String(config.poles)}
                onValueChange={(v) => updateConfig({ poles: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POLE_OPTIONS.map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      {p} poles ({Math.round((120 * config.frequency) / p)} RPM sync)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              onClick={() => toast.success("Settings saved", { description: "Applied to all simulations." })}
              className="bg-gradient-primary text-primary-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              Save & Apply
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to defaults
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground px-1">
            Computed values
          </div>
          <Metric label="Synchronous speed" value={Math.round(syncSpeed)} unit="RPM" />
          <Metric label="Rated speed (≈3.3% slip)" value={ratedSpeed} unit="RPM" />
          <Metric label="Full-load current" value={ratedCurrent.toFixed(1)} unit="A" />
          <div className="rounded-xl border border-border bg-gradient-card p-4 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Note:</strong> Full-load current is estimated assuming
            power factor ≈ 0.85 and efficiency ≈ 0.9 using
            <br />
            <code className="text-primary">I = P / (√3 · V · pf · η)</code>
          </div>
        </div>
      </div>
    </div>
  );
}
