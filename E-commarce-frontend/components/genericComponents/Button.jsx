import clsx from "clsx";

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base = clsx(
    "text-center",
    "flex items-center justify-center rounded-full font-light cursor-pointer",
    "active:scale-120 transition-all duration-400 ease-in-out focus:outline-none "
  );

  const variants = {
    primary: "bg-[#FF6543] text-white hover:bg-[#C0C0C0]",
    secondary: "bg-zinc-100 text-[#272727] hover:bg-zinc-200",
    ghost: "bg-transparent text-[#FF6543] hover:bg-[#FF6543]/10",
  };

  const sizes = {
    base: "px-[10px] py-[8px] text-[8px]",
    sm: "px-[22px] py-[8px] text-[12px]",
    md: "px-[32px] py-[10px] text-[14px]",
    lg: "px-[42px] py-[12px] text-[16px]",
  };

  return (
    <button
      className={clsx(
        base,
        `lg:${sizes["lg"]} md:${sizes["md"]} sm:${sizes["sm"]} ${sizes["base"]}`,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
