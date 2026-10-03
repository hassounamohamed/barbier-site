import { config } from "@/lib/config";
import type { Messages } from "@/lib/i18n";

export default function WhatsAppFloat({ messages }: { messages: Messages }) {
  return (
    <a className="wa" href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={messages.labels.whatsapp}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.7 9.7 0 0 0-8.4 14.55L2 22l5.6-1.55A9.7 9.7 0 1 0 12 2Zm0 17.8a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.32.92.9-3.23-.2-.33A8.1 8.1 0 1 1 12 19.8Z" /></svg>
    </a>
  );
}