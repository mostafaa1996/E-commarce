import clsx from "clsx";
import { twMerge } from "tailwind-merge";
export default function SwitchToggle({ enabled, onToggle , className }) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={twMerge(clsx(`
        w-12 h-6 flex items-center rounded-full p-1 transition
        ${enabled ? "bg-[#FF6543]" : "bg-zinc-300"}
      `, className))}
    >
      <div
        className={`
          bg-white w-4 h-4 rounded-full shadow transform transition
          ${enabled ? "translate-x-6" : ""}
        `}
      />
    </button>
  );
}
