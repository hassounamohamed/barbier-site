"use client";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import type { Messages } from "@/lib/i18n";
import { nowInTunis } from "@/lib/slots";

export default function HoursBadge({ messages }: { messages: Messages }) {
  const [state, setState] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const now = nowInTunis();
      const h = config.hours[now.day];
      const open = !!h && now.minutes >= h[0] * 60 && now.minutes < h[1] * 60;
      setState({ open, text: open ? messages.status.open.replace("{hour}", `${h![1]}`) : messages.status.closed });
    };

    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [messages.status.closed, messages.status.open]);

  return (
    <div className={`badge ${state ? (state.open ? "open" : "closed") : ""}`}>
      <i />{state?.text ?? messages.status.loading}
    </div>
  );
}