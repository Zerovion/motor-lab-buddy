// Simple conceptual induction-motor simulation helpers.
// Not real physics — designed for smooth, educational visualization.

export interface SimPoint {
  t: number;       // seconds
  current: number; // Amps
  speed: number;   // RPM
  torque: number;  // % of full-load torque
}

export interface MotorConfig {
  ratedPowerKW: number;  // kW
  voltage: number;       // V (line-to-line)
  frequency: number;     // Hz
  poles: number;         // number of poles (2,4,6,8...)
}

export const DEFAULT_MOTOR_CONFIG: MotorConfig = {
  ratedPowerKW: 7.5,
  voltage: 400,
  frequency: 50,
  poles: 4,
};

/** Synchronous speed (RPM) = 120 * f / poles. Rated speed ~ 96.7% of sync (3.3% slip). */
export function ratedSpeedFor(cfg: MotorConfig): number {
  const sync = (120 * cfg.frequency) / cfg.poles;
  return Math.round(sync * 0.967);
}

/** Approximate full-load current from rated power, voltage, assuming PF≈0.85, η≈0.9. */
export function ratedCurrentFor(cfg: MotorConfig): number {
  const pf = 0.85;
  const eff = 0.9;
  const i = (cfg.ratedPowerKW * 1000) / (Math.sqrt(3) * cfg.voltage * pf * eff);
  return Math.max(0.1, i);
}

// Backwards-compatible defaults (used where a config isn't threaded through).
export const RATED_SPEED = ratedSpeedFor(DEFAULT_MOTOR_CONFIG);
export const RATED_CURRENT = ratedCurrentFor(DEFAULT_MOTOR_CONFIG);

/** Generic exponential rise/fall used for many models. */
const ease = (x: number) => 1 - Math.exp(-x);

export function dolStep(t: number, cfg: MotorConfig = DEFAULT_MOTOR_CONFIG): SimPoint {
  const ratedI = ratedCurrentFor(cfg);
  const ratedN = ratedSpeedFor(cfg);
  const inrush = 7 * ratedI;
  const decay = Math.exp(-t / 0.6);
  const speedFrac = ease(t / 1.0);
  const current = ratedI + (inrush - ratedI) * decay * (1 - speedFrac * 0.5);
  const speed = ratedN * speedFrac;
  const torque = 180 * decay + 100 * speedFrac * (1 - speedFrac);
  return { t, current, speed, torque };
}

export function starDeltaStep(
  t: number,
  switchAt: number,
  cfg: MotorConfig = DEFAULT_MOTOR_CONFIG,
): SimPoint {
  const ratedI = ratedCurrentFor(cfg);
  const ratedN = ratedSpeedFor(cfg);
  if (t < switchAt) {
    const decay = Math.exp(-t / 0.8);
    const speedFrac = ease(t / 2.5) * 0.55;
    const current = (ratedI * 2.3) * decay + ratedI * 0.6;
    return {
      t,
      current,
      speed: ratedN * speedFrac,
      torque: 60 * decay + 30 * speedFrac,
    };
  }
  const dt = t - switchAt;
  const decay = Math.exp(-dt / 0.5);
  const speedFrac = 0.55 + (1 - 0.55) * ease(dt / 1.2);
  const surge = 5 * ratedI * decay;
  const current = surge + ratedI * (1 + (1 - speedFrac) * 0.5);
  const torque = 150 * decay + 100 * speedFrac * (1 - speedFrac * 0.5);
  return { t, current, speed: ratedN * speedFrac, torque };
}

export function autoTransformerStep(
  t: number,
  tap: number,
  cfg: MotorConfig = DEFAULT_MOTOR_CONFIG,
): SimPoint {
  const ratedI = ratedCurrentFor(cfg);
  const ratedN = ratedSpeedFor(cfg);
  const inrush = 7 * ratedI * tap;
  const decay = Math.exp(-t / 0.7);
  const speedFrac = ease(t / (1.6 / Math.max(tap, 0.3)));
  const current = ratedI + (inrush - ratedI) * decay * (1 - speedFrac * 0.5);
  const torque = (180 * tap * tap) * decay + (100 * tap * tap) * speedFrac * (1 - speedFrac);
  return { t, current, speed: ratedN * speedFrac, torque };
}

export function vfStep(
  t: number,
  freq: number,
  prevSpeed: number,
  cfg: MotorConfig = DEFAULT_MOTOR_CONFIG,
): SimPoint {
  const ratedI = ratedCurrentFor(cfg);
  const ratedN = ratedSpeedFor(cfg);
  const targetSpeed = (freq / cfg.frequency) * ratedN;
  const newSpeed = prevSpeed + (targetSpeed - prevSpeed) * 0.05;
  const current =
    ratedI * (0.6 + 0.6 * Math.abs(targetSpeed - prevSpeed) / Math.max(ratedN, 1) + 0.4);
  const torque = 100 - Math.abs(targetSpeed - newSpeed) / Math.max(ratedN, 1) * 30;
  return { t, current: Math.min(current, ratedI * 1.5), speed: newSpeed, torque };
}

export function rotorResistanceStep(
  t: number,
  rStep: number,
  cfg: MotorConfig = DEFAULT_MOTOR_CONFIG,
): SimPoint {
  const ratedI = ratedCurrentFor(cfg);
  const ratedN = ratedSpeedFor(cfg);
  const r = 1 + rStep * 0.6;
  const inrush = (7 / r) * ratedI;
  const decay = Math.exp(-t / (0.6 + rStep * 0.2));
  const speedFrac = ease(t / (1 + rStep * 0.4)) * (1 - rStep * 0.04);
  const current = ratedI * 0.8 + (inrush - ratedI * 0.8) * decay * (1 - speedFrac * 0.3);
  const torqueBoost = 100 + rStep * 35;
  const torque = torqueBoost * decay + 100 * speedFrac * (1 - speedFrac);
  return { t, current, speed: ratedN * speedFrac, torque };
}

// Torque-vs-Speed curve (steady state) for visualization
export function torqueSpeedCurve(
  scaleV = 1,
  rotorR = 1,
  points = 60,
  cfg: MotorConfig = DEFAULT_MOTOR_CONFIG,
): { speed: number; torque: number }[] {
  const ratedN = ratedSpeedFor(cfg);
  const out: { speed: number; torque: number }[] = [];
  for (let i = 0; i <= points; i++) {
    const s = 1 - i / points;
    const speed = ratedN * (1 - s);
    const sMax = 0.2 * rotorR;
    const tMax = 200 * scaleV * scaleV;
    const torque = (2 * tMax) / (s / sMax + sMax / s);
    out.push({ speed: Math.round(speed), torque: Math.max(0, torque) });
  }
  return out;
}
