import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base = `text-center flex items-center justify-center rounded-full font-light cursor-pointer
     active:scale-90 transition-all duration-400 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`;

  const variants = {
    primary: "bg-[#FF6543] text-white hover:bg-[#C0C0C0]",
    secondary: "bg-zinc-100 text-[#272727] hover:bg-zinc-200",
    ghost: "bg-transparent text-[#272727] hover:bg-[#FF6543]/10",
  };

const sizes = {
  base: "px-[6px] py-[6px] text-[8px]",
  sm: "sm:px-[16px] sm:py-[6px] sm:text-[12px]",
  md: "md:px-[16px] md:py-[7px] md:text-[14px]",
  lg: "lg:px-[22px] lg:py-[8px] lg:text-[18px]",
};

  return (
    <button
      className={twMerge(
        clsx(
          base,
          clsx(sizes["lg"], sizes["md"], sizes["sm"], sizes["base"]),
          variants[variant],
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  );
}
