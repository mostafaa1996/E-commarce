import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export default function Tag({ children, color = "bg-blue-600" , className }) {
  return (
    <span
      className={twMerge(clsx(
        "inline-block text-white text-xs px-3 rounded-md",
        color , className
      ))}
    >
      {children}
    </span>
  );
};