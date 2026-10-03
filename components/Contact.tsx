import { config } from "@/lib/config";
import Reveal from "./Reveal";
import Icon from "./Icon";
import type { Messages } from "@/lib/i18n";

export default function Contact({ messages }: { messages: Messages }) {
  return (
    <section className="contact" id="contact">
      <Reveal as="h2">{messages.contact.title}</Reveal>
      <Reveal delay={0.1}><p>{messages.contact.copy}</p></Reveal>
      <Reveal delay={0.2} className="btns">
        <a className="btn p" href={`tel:${config.phone}`}><Icon name="phone" size={20} />{messages.contact.call}</a>
        <a className="btn s" href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={20} />{messages.contact.whatsapp}</a>
        <a className="btn s" href={config.instagram} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={20} />{messages.contact.instagram}</a>
        <a className="btn s" href={config.facebook} target="_blank" rel="noopener noreferrer"><Icon name="facebook" size={20} />{messages.contact.facebook}</a>
      </Reveal>
    </section>
  );
}