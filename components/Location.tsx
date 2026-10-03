import { config } from "@/lib/config";
import Reveal from "./Reveal";
import Hours from "./Hours";
import Icon from "./Icon";
import type { Messages } from "@/lib/i18n";

export default function Location({ messages }: { messages: Messages }) {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${config.name} ${config.address}`)}`;
  return (
    <section id="infos">
      <Reveal as="h2">{messages.location.title}</Reveal>
      <div className="cards">
        <Reveal className="card shadow">
          <h3><Icon name="clock" size={24} />{messages.location.hours}</h3>
          <Hours messages={messages} />
        </Reveal>
        <Reveal delay={0.15} className="card shadow">
          <span className="pin"><Icon name="pin" size={48} /></span>
          <h3>{messages.location.address}</h3>
          <p>{config.address}</p>
          <a className="btn p" href={maps} target="_blank" rel="noopener noreferrer"><Icon name="navigation" size={20} />{messages.location.directions}</a>
        </Reveal>
      </div>
    </section>
  );
}