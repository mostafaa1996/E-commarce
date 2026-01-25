export default function QuantityControl({ value , onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={()=> {onChange(value - 1)}}
        disabled={value === 0}
        className="w-8 h-8 border border-zinc-200 rounded-md text-sm"
      >
        −
      </button>
      <span className="w-8 text-center text-[16px] font-light">
        {value}
      </span>
      <button
        onClick={()=> {onChange(value + 1)}}
        className="w-8 h-8 border border-zinc-200 rounded-md text-sm"
      >
        +
      </button>
    </div>
  );
}
