function shortenText(text, maxLength = 20) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + "...";
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatTime(t){
  const date = new Date(t);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export { shortenText };
