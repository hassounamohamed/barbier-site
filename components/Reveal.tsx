"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

export default function Reveal({
  children, delay = 0, as = "div", className = "",
}: { children: ReactNode; delay?: number; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv ${className}`} style={{ "--d": `${delay}s` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}