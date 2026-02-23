export default function QuantityControl({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          onChange(value - 1);
        }}
        disabled={value === 0}
        className={`w-8 h-8 border border-zinc-200 rounded-md text-sm cursor-pointer
          hover:bg-zinc-200 hover:scale-125 hover:text-md
          `}
      >
        −
      </button>
      <span className="w-8 text-center text-[16px] font-light">{value}</span>
      <button
        onClick={() => {
          onChange(value + 1);
        }}
        className={`w-8 h-8 border border-zinc-200 rounded-md text-sm cursor-pointer
          hover:bg-zinc-200 hover:scale-125 hover:text-md
          `}
      >
        +
      </button>
    </div>
  );
}
