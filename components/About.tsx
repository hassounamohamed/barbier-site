import { config } from "@/lib/config";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import type { Messages } from "@/lib/i18n";
import Image from "next/image";

export default function About({ messages }: { messages: Messages }) {
  const years = new Date().getFullYear() - config.since;

  return (
    <section id="about">
      <Reveal as="h2">{messages.about.title}</Reveal>
      <Reveal delay={0.1} className="frame">
        <div className="about-layout">
          <div className="card">
            <p style={{ fontSize: "1.15rem", marginTop: 0 }}>
              {messages.about.copy.replace("{barber}", config.barber).replace("{years}", String(years))}
            </p>
            <div className="stats">
              {config.stats.map((s) => (
                <div key={s.key}>
                  <CountUp n={s.n} suffix={s.suffix} />
                  <span>{messages.about.stats[s.key as keyof Messages["about"]["stats"]]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about-photo">
            <Image src={config.aboutImage} alt={`${config.name} - ${messages.about.title}`} fill sizes="(max-width: 600px) 100vw, 42vw" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}