import { useState } from "react";
import { useShopQueryStore } from "../../src/ShopQueryStore";
export default function SidebarFilter({ title, items, applyFilter}) {
  const [MultiItemSelected, setMultiItemSelected] = useState([]);
  const [singleItemSelected, setsingleItemSelected] = useState("");
  const Data = useShopQueryStore((state) => state.shopQuery[title]);
  return (
    <div>
      <h3 className="text-[30px] font-extralight uppercase tracking-wide">
        {title}
      </h3>

      <div
        className="mt-2 mb-6 h-[10px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #D4D4D4 0 1px, transparent 1px 10px)",
        }}
      />

      <ul className="mt-4 space-y-2 text-[21px] text-[#272727] font-extralight">
        {items.map((item) => (
          <li
            key={item}
            className={` 
              hover:text-[#FF6543] active:scale-110 transition duration-300 ease-in
              ${(Array.isArray(Data) && MultiItemSelected.includes(item))||
                (!Array.isArray(Data) && singleItemSelected === item) ? "text-[#FF6543]" : ""}`}
          >
            <button
              onClick={() => {
                // toggle the selected state
                if(!Array.isArray(Data) && singleItemSelected === item){
                  setsingleItemSelected("");
                }
                else if (!Array.isArray(Data) && singleItemSelected !== item) {
                  setsingleItemSelected(item);
                }
                if (Array.isArray(Data) && MultiItemSelected.includes(item)) {
                  setMultiItemSelected(MultiItemSelected.filter((i) => i !== item));
                } else if (Array.isArray(Data) && !MultiItemSelected.includes(item)) {
                  setMultiItemSelected(prev=> [...prev, item]);
                }
                applyFilter(item, title);
              }}
              className="cursor-pointer "
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
