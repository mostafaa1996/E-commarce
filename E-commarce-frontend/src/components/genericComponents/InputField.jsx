import clsx from "clsx";
import { forwardRef } from "react";

const InputField = forwardRef(function InputField(
  { label, placeholder, type = "text", className, ...props },
  ref
) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm text-zinc-500">{label}</label>}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={clsx(`
          w-full
          px-4
          py-3
          border
          border-zinc-200
          rounded-lg
          text-[16px]
          font-light
          placeholder:text-zinc-400
          focus:outline-none
          focus:border-[#FF6543]
        `, className)}
        {...props}
      />
    </div>
  );
});

export default InputField;
