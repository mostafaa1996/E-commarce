import clsx from "clsx";
import { twMerge } from "tailwind-merge";
export default function Card({ children, className = ""}) {
  return (
    <div
      className={twMerge(clsx(
        `
        bg-white
        border border-zinc-200
        rounded-xl
        overflow-hidden
        hover:shadow-lg
        hover:border-[#FF6543]
        active:scale-95
        transition
      `,
        className
      ))}
    >
      {children}
    </div>
  );
}
