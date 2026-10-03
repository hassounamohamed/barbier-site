"use client";
import { useEffect, useRef } from "react";

export default function CountUp({ n, suffix = "" }: { n: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1600, 1);
        if (el) el.textContent = `${Math.round(n * (1 - Math.pow(1 - p, 3)))}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [n, suffix]);

  return <b ref={ref}>0{suffix}</b>;
}