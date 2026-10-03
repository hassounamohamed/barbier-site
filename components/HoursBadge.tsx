"use client";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import type { Messages } from "@/lib/i18n";

export default function HoursBadge({ messages }: { messages: Messages }) {
  const [state, setState] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const d = new Date();
    const h = config.hours[d.getDay()];
    const now = d.getHours() + d.getMinutes() / 60;
    const open = !!h && now >= h[0] && now < h[1];
    requestAnimationFrame(() => setState({ open, text: open ? messages.status.open.replace("{hour}", `${h![1]}`) : messages.status.closed }));
  }, [messages.status.closed, messages.status.open]);

  return (
    <div className={`badge ${state ? (state.open ? "open" : "closed") : ""}`}>
      <i />{state?.text ?? messages.status.loading}
    </div>
  );
}