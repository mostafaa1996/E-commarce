import SearchBox from "../../../components/genericComponents/SearchBox";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
export default function OrderSearchAndFilteration({
  tabs,
  className,
  active,
  setSearchValue,
  setActive,
  SearchSubmitEvent,
}) {
  function onChange(tab) {
    setActive(tab);
  }
  return (
    <div
      className={twMerge(
        clsx(`mt-4 rounded-xl border border-zinc-200 bg-white p-4 sm:mt-6 sm:p-6`, className),
      )}
    >
      <SearchBox
        placeholder="Search by order ID or item..."
        className="w-full"
        onChange={setSearchValue}
        onClickSearch={SearchSubmitEvent}
      />
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible">
        {tabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition
            ${
              active === tab
                ? "bg-[#FF6543] text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }
          `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
