import { forwardRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const DropdownMenu = forwardRef(function DropdownMenu(
  { results = [], onSelect, ...props },
  Ref
) {
  return (
    <div
      className={twMerge(
        clsx(
          `absolute top-full left-0 w-full mt-2 bg-white border border-zinc-200 rounded-xl 
           shadow-lg z-50 max-h-64 overflow-y-auto`,
          props.className
        )
      )}
      ref={Ref}
    >
      {results &&
        results.map((item) => (
          <button
            key={item._id}
            onClick={() => onSelect(item._id)}
            className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-zinc-50 transition"
          >
            {item.images[0].url && (
              <img
                src={item.images[0].url}
                alt={item.title}
                className="w-10 h-10 object-contain rounded"
              />
            )}

            <div className="flex flex-col">
              <span className="text-sm font-light text-[#272727] line-clamp-1">
                {item.title}
              </span>

              {item.price && (
                <span className="text-xs text-[#FF6543]">{item.price}</span>
              )}
            </div>
          </button>
        ))}
      {results.length === 0 && (
        <p className="px-4 py-3 text-center text-[#272727]">No results found</p>
      )}
    </div>
  );
});

export default DropdownMenu;
