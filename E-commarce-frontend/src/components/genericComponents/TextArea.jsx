import clsx from "clsx";
import { twMerge } from "tailwind-merge";
export default function TextArea({ label, placeholder, ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm text-zinc-500">{label}</label>}
      <textarea
        rows={4}
        placeholder={placeholder}
        {...props}
        className={twMerge(
          clsx(
            `
          w-full
          px-4
          py-3
          border
          border-zinc-200
          rounded-lg
          text-[16px]
          font-light
          placeholder:text-zinc-400
          resize-none
          focus:outline-none
          focus:border-[#FF6543]
        `,
            props.className,
          ),
        )}
      />
    </div>
  );
}
