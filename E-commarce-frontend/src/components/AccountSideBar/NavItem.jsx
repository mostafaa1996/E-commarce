export default function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-lg border-b-2 px-3 py-3 text-left transition lg:w-full lg:gap-3 lg:rounded-none lg:border-b-0 lg:border-r-2 lg:px-6 lg:py-4
        cursor-pointer
        ${
          active
            ? "bg-[#FDE9E4] text-[#FF6543] border-b-[#FF6543] lg:border-b-transparent lg:border-r-[#FF6543]"
            : "text-zinc-600 border-transparent hover:bg-zinc-50"
        }
      `}
    >
      <span className={active ? "text-[#FF6543]" : "text-zinc-400"}>
        {icon}
      </span>

      <span className="whitespace-nowrap text-sm font-light">{label}</span>
    </button>
  );
}
