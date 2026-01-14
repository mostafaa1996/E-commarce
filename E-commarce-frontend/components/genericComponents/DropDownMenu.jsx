export default function DropdownMenu({ results = [], onSelect }) {
  if (!results.length) return null;
  
  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
      {results.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.title)}
          className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-zinc-50 transition"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-10 h-10 object-contain rounded"
            />
          )}

          <div className="flex flex-col">
            <span className="text-sm font-light text-[#272727]">
              {item.title}
            </span>

            {item.price && (
              <span className="text-xs text-[#FF6543]">${item.price}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
