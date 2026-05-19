import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_MOTOR_CONFIG,
  ratedCurrentFor,
  ratedSpeedFor,
  type MotorConfig,
} from "@/lib/motor";

const STORAGE_KEY = "motor-lab-config-v1";

interface MotorConfigContextValue {
  config: MotorConfig;
  ratedCurrent: number;
  ratedSpeed: number;
  syncSpeed: number;
  setConfig: (next: MotorConfig) => void;
  updateConfig: (patch: Partial<MotorConfig>) => void;
  reset: () => void;
}

const MotorConfigContext = createContext<MotorConfigContextValue | null>(null);

function loadConfig(): MotorConfig {
  if (typeof window === "undefined") return DEFAULT_MOTOR_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MOTOR_CONFIG;
    const parsed = JSON.parse(raw) as Partial<MotorConfig>;
    return { ...DEFAULT_MOTOR_CONFIG, ...parsed };
  } catch {
    return DEFAULT_MOTOR_CONFIG;
  }
}

export function MotorConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<MotorConfig>(() => loadConfig());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore quota errors
    }
  }, [config]);

  const setConfig = useCallback((next: MotorConfig) => setConfigState(next), []);
  const updateConfig = useCallback(
    (patch: Partial<MotorConfig>) => setConfigState((c) => ({ ...c, ...patch })),
    [],
  );
  const reset = useCallback(() => setConfigState(DEFAULT_MOTOR_CONFIG), []);

  const value = useMemo<MotorConfigContextValue>(() => {
    const syncSpeed = (120 * config.frequency) / config.poles;
    return {
      config,
      ratedCurrent: ratedCurrentFor(config),
      ratedSpeed: ratedSpeedFor(config),
      syncSpeed,
      setConfig,
      updateConfig,
      reset,
    };
  }, [config, setConfig, updateConfig, reset]);

  return <MotorConfigContext.Provider value={value}>{children}</MotorConfigContext.Provider>;
}

export function useMotorConfig() {
  const ctx = useContext(MotorConfigContext);
  if (!ctx) throw new Error("useMotorConfig must be used within MotorConfigProvider");
  return ctx;
}
