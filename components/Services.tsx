import { config } from "@/lib/config";
import Reveal from "./Reveal";
import Icon from "./Icon";
import type { Messages } from "@/lib/i18n";

export default function Services({ messages }: { messages: Messages }) {
  return (
    <section id="services">
      <Reveal as="h2">{messages.services.title}</Reveal>
      <div className="cards">
        {config.services.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.1} className="card svc">
            <em><Icon name={s.icon as React.ComponentProps<typeof Icon>["name"]} size={32} /></em>
            <h3>{messages.services.items[s.id as keyof Messages["services"]["items"]].title}</h3>
            <p>{messages.services.items[s.id as keyof Messages["services"]["items"]].desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}