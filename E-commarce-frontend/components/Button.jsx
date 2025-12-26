import clsx from "clsx";
export default function Button({ className = "", children }) {
  const CustomclassName = className;
  return (
    <button
      className={clsx(
        "bg-[#FF6543] text-white",
        "hover:bg-[#C0C0C0] active:scale-115 transition-all duration-300 ease-in-out",
        "lg:py-[12px] md:py-[10px] py-[8px] lg:px-[42px] md:px-[32px] px-[10px] rounded-full ",
        `font-light cursor-pointer lg:text-[16px] md:[14px] sm:text-[12px] text-[8px] text-center ${CustomclassName}`
      )}
    >
      {children}
    </button>
  );
}
