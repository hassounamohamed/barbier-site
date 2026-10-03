"use client";
import { useEffect, useRef } from "react";

export default function BarberPole() {
  const st = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const P = 113.137; // période verticale des rayures
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let y = 0, v = 0, last = window.scrollY, raf = 0, scrollHeight = document.documentElement.scrollHeight;

    const loop = () => {
      const ds = Math.abs(window.scrollY - last);
      last = window.scrollY;
      v += (Math.min(ds * 0.5, 16) - v) * 0.12; // vitesse selon le scroll
      if (!reduce) y = (y + 0.8 + v) % P;
      if (st.current) st.current.style.transform = `translateY(${-y}px)`;
      const max = scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      raf = requestAnimationFrame(loop);
    };
    const onResize = () => { scrollHeight = document.documentElement.scrollHeight; };
    const onVisibility = () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(loop); };
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility, { passive: true });
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  return (
    <>
      <div ref={bar} id="bar" />
      <div className="pole" aria-hidden="true">
        <div className="cap t" />
        <div className="tube"><div ref={st} className="st" /></div>
        <div className="cap b" />
      </div>
    </>
  );
}