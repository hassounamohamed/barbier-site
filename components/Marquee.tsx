import type { Messages } from "@/lib/i18n";
import Icon from "./Icon";

export default function Marquee({ messages }: { messages: Messages }) {
  const text = messages.marquee.split(" • ");
  return (
    <div className="mq" aria-hidden="true">
      <div>{Array.from({ length: 16 }, (_, i) => <span key={i}>{text[i % text.length]}<Icon name="scissors" size={16} /></span>)}</div>
    </div>
  );
}