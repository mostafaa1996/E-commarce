import { iconMap } from "./iconMap";
import clsx from "clsx";

export default function Icon({
  name,
  size = 18,
  variant = "default",
  className = "",
  strokeWidth = 1.5,
}) {
  const Component = iconMap[name];

  if (!Component) return null;

  const variants = {
    default: "text-[#272727]",
    muted: "text-zinc-400",
    primary: "text-[#FF6543]",
    danger: "text-red-500",
    success: "text-green-600",
    warning: "text-yellow-500",
    surrounded: "text-white",
  };

  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      className={clsx(variants[variant], className)}
    />
  );
}
