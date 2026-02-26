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
        clsx(`border border-zinc-200 rounded-xl bg-white p-6 mt-6`, className),
      )}
    >
      <SearchBox
        placeholder="Search by order ID or item..."
        className="w-full"
        onChange={setSearchValue}
        onClickSearch={SearchSubmitEvent}
      />
      <div className="flex flex-wrap gap-3 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-1.5 text-sm rounded-full transition
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
