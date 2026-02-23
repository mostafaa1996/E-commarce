import DropDownMenuArrow from "/drop_down_menu.svg";
import { useState } from "react";
export default function ProductsSortingOption({ sort, ShowFilterMenu }) {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500 hover:text-[#FF6543]">
      <p>{sort}</p>
      <button
        onClick={() => {
          setClicked(!clicked);
          ShowFilterMenu();
        }}
        className={`cursor-pointer hover:scale-115 transition duration-300 ease-in-out
          ${clicked ? "rotate-180" : ""}`}
      >
        <img src={DropDownMenuArrow} alt=" Drop Down Menu" />
      </button>
    </div>
  );
}
