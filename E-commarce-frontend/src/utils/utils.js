function shortenText(text, maxLength = 20) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + "...";
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatTime(t){
  let date = new Date(t);
  // 2026-03-12T16:54:55.139Z -> 2026-03-12
  return date.toLocaleDateString('en-US') === "Invalid Date" ? "" : date.toLocaleDateString('en-US');
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export { shortenText };