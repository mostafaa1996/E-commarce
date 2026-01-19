export default function OptionGroup({ label, options }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase text-zinc-500 tracking-wide">
        {label}
      </span>

      <div className="flex gap-4 text-sm text-zinc-600">
        {options.map((option) => (
          <button key={option} className="hover:text-[#FF6543] transition">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
