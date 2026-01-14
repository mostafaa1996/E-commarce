import DropdownMenu from "./DropDownMenu";
import SearchBtn from "/SearchBtn.svg";
import clsx from "clsx";
import { useRef } from "react";
export default function SearchBar({ placeholder = "Search" , onChange , onClickSearch , results }) {
  const inputRef = useRef(null);
  return (
    <div className="relative">
      <div className="flex items-center border border-zinc-200 rounded-md w-[310px]">
        <input
          type="text"
          placeholder={placeholder}
          ref={inputRef}
          onChange={()=>onChange(inputRef.current.value)}
          className={clsx(
            "flex-1 px-4 py-4 text-sm font-light outline-none",
            " placeholder:text-zinc-400"
          )}
        />

        <button
          className="w-10 h-10 mx-3 cursor-pointer active:scale-120 transition duration-300 ease-in-out"
          aria-label="Search"
          onClick={()=>onClickSearch(inputRef.current.value)}
        >
          <img src={SearchBtn} alt="Search" />
        </button>
      </div>
      {results && <DropdownMenu results={results} onSelect={() => {}} />}
    </div>
  );
}
