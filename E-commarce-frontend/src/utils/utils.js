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

export function mongoDateToInputDate(value) {
  if (!value) return "";

  if (typeof value === "string" && value.includes("T")) {
    return value.split("T")[0];
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export { shortenText };
