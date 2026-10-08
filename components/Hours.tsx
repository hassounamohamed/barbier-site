"use client";
import { useSyncExternalStore } from "react";
import { config } from "@/lib/config";
import type { Messages } from "@/lib/i18n";
import { nowInTunis, subscribeToTunisDay } from "@/lib/slots";

export default function Hours({ messages }: { messages: Messages }) {
  const today = useSyncExternalStore(
    subscribeToTunisDay,
    () => nowInTunis().day,
    () => null,
  );

  return (
    <table>
      <tbody>
        {[1, 2, 3, 4, 5, 6, 0].map((k) => {
          const h = config.hours[k];
          return (
            <tr key={k} className={k === today ? "today" : ""}>
              <td>{messages.hours.days[k]}</td>
              <td>{h ? `${h[0]}h – ${h[1]}h` : messages.location.closed}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}