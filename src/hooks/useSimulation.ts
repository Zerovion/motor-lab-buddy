import { useEffect, useRef, useState, useCallback } from "react";
import type { SimPoint } from "@/lib/motor";

type Stepper = (t: number, prev?: SimPoint) => SimPoint;

interface Options {
  step: Stepper;
  fps?: number;
  maxSeconds?: number;
}

export function useSimulation({ step, fps = 20, maxSeconds = 10 }: Options) {
  const [running, setRunning] = useState(false);
  const [data, setData] = useState<SimPoint[]>([]);
  const [current, setCurrent] = useState<SimPoint>({ t: 0, current: 0, speed: 0, torque: 0 });
  const tRef = useRef(0);
  const timer = useRef<number | null>(null);
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const tick = useCallback(() => {
    tRef.current += 1 / fps;
    const t = tRef.current;
    setData((prev) => {
      const last = prev[prev.length - 1];
      const next = stepRef.current(t, last);
      const arr = [...prev, next];
      setCurrent(next);
      if (t >= maxSeconds) {
        setRunning(false);
      }
      return arr.slice(-fps * maxSeconds);
    });
  }, [fps, maxSeconds]);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(tick, 1000 / fps);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running, fps, tick]);

  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    tRef.current = 0;
    setData([]);
    setCurrent({ t: 0, current: 0, speed: 0, torque: 0 });
  }, []);

  return { running, data, current, start, stop, reset };
}
