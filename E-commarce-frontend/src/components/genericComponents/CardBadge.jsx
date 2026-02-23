import clsx from "clsx";
import { twMerge } from "tailwind-merge";
export default function Badge({ children, className }) {
  return (
    <span
      className={twMerge(
        clsx(
          `
      absolute top-4 right-4
      text-xs px-3 py-1
      rounded-full
      bg-[#FF6543]
      text-white
    `,
          className,
        ),
      )}
    >
      {children}
    </span>
  );
}
