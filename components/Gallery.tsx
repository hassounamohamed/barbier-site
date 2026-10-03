"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { config } from "@/lib/config";
import Reveal from "./Reveal";
import Icon from "./Icon";
import type { Messages } from "@/lib/i18n";

type Item = (typeof config.gallery)[number];
const vars = (g: Item) => ({ "--c1": g.c1, "--c2": g.c2 }) as React.CSSProperties;

function Content({ g, alt, sizes }: { g: Item; alt: string; sizes: string }) {
  return g.src ? <Image src={g.src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} /> : <Icon name="scissors" size={96} />;
}

export default function Gallery({ messages }: { messages: Messages }) {
  const [open, setOpen] = useState<number | null>(null);
  const touch = useRef(0);
  const n = config.gallery.length;

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, go]);

  return (
    <section id="galerie">
      <Reveal as="h2">{messages.gallery.title}</Reveal>
      <Reveal className="gal">
        {config.gallery.map((g, i) => (
          <button key={i} className="g" style={vars(g)} aria-label={messages.galleryControls.open.replace("{alt}", messages.gallery.alts[i])} onClick={() => setOpen(i)}>
            <Content g={g} alt={messages.gallery.alts[i]} sizes="(max-width: 600px) 50vw, 33vw" />
            <span className="g-overlay"><Icon name="zoom" size={28} /></span>
          </button>
        ))}
      </Reveal>

      {open !== null && (
        <div
          className="lb" role="dialog" aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <button className="x" aria-label={messages.galleryControls.close} onClick={() => setOpen(null)}><Icon name="close" /></button>
          <button className="pv" aria-label={messages.galleryControls.previous} onClick={() => go(-1)}><Icon name="previous" /></button>
          <div className="box" style={vars(config.gallery[open])}>
            <Content g={config.gallery[open]} alt={messages.gallery.alts[open]} sizes="90vw" />
          </div>
          <button className="nx" aria-label={messages.galleryControls.next} onClick={() => go(1)}><Icon name="next" /></button>
        </div>
      )}
    </section>
  );
}