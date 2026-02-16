export default function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-4 text-left transition border-r-2
        cursor-pointer
        ${
          active
            ? "bg-[#FDE9E4] text-[#FF6543] border-r-[#FF6543]"
            : "text-zinc-600 border-transparent hover:bg-zinc-50"
        }
      `}
    >
      <span className={active ? "text-[#FF6543]" : "text-zinc-400"}>
        {icon}
      </span>

      <span className="text-sm font-light">{label}</span>
    </button>
  );
}
