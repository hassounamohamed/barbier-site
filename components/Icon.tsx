"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  MapPin,
  Moon,
  Navigation,
  Phone,
  Scissors,
  Smile,
  Sparkles,
  Star,
  Sun,
  X,
  ZoomIn,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

type IconName =
  | "scissors" | "razor" | "beard" | "kid" | "star" | "pole"
  | "phone" | "clock" | "pin" | "zoom" | "close" | "previous"
  | "next" | "sparkles" | "smile" | "navigation" | "sun" | "moon" | "globe"
  | "whatsapp" | "instagram" | "facebook";

const icons: Partial<Record<IconName, ComponentType<LucideProps>>> = {
  scissors: Scissors,
  razor: Scissors,
  beard: Smile,
  kid: Smile,
  star: Star,
  pole: Scissors,
  phone: Phone,
  clock: Clock3,
  pin: MapPin,
  zoom: ZoomIn,
  close: X,
  previous: ChevronLeft,
  next: ChevronRight,
  sparkles: Sparkles,
  smile: Smile,
  navigation: Navigation,
  sun: Sun,
  moon: Moon,
  globe: Globe2,
};

export type { IconName };

export default function Icon({ name, size = 20, strokeWidth = 1.75, className }: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  if (name === "whatsapp" || name === "instagram" || name === "facebook") {
    const path = name === "whatsapp"
      ? "M12 2a9.7 9.7 0 0 0-8.4 14.55L2 22l5.6-1.55A9.7 9.7 0 1 0 12 2Zm0 17.8a8.1 8.1 0 1 1 0-16.2 8.1 8.1 0 0 1 0 16.2Z"
      : name === "instagram"
        ? "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
        : "M13 22v-8h2.7l.4-3H13V9.1c0-.9.25-1.5 1.55-1.5H16V4.9c-.25 0-1.1-.1-2.1-.1-2.1 0-3.55 1.3-3.55 3.7V11H8v3h2.35v8H13Z";
    return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true"><path d={path} /></svg>;
  }
  const Component = icons[name];
  if (!Component) return null;
  return <Component size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
