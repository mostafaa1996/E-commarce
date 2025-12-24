import clsx from "clsx";
export default function Button({ children }) {
  return (
    <button
      className={clsx(
        "bg-[#FF6543] text-white",
        "hover:bg-[#C0C0C0] active:scale-115 transition-all duration-300 ease-in-out",
        "py-[12px] px-[42px] rounded-full ",
        "font-light cursor-pointer text-[16px] text-center"
      )}
    >
      {children}
    </button>
  );
}
