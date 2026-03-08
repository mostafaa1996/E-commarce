import DropDownMenu from "@/components/genericComponents/DropDownMenu";
import ProductsSortingOption from "@/components/genericComponents/ProductsSortingOption";
import { useShopQueryStore } from "@/zustand_ShopPage/ShopQueryStore";
import { useState , useRef , useEffect } from "react";

const sortingArray = [
  "price-asc",
  "price-desc",
  "newest",
  "oldest",
  "rating",
  "Alphabetical",
  "ReverseAlphabetical",
  "Default sorting",
];
export default function SortingSection() {
  const [showMenu, setShowMenu] = useState(false);
  const { shopQuery, setShopQuery } = useShopQueryStore();
  const MenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (MenuRef.current && !MenuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function ShowFilterMenu() {
    setShowMenu(!showMenu);
  }
  function onSelect(value) {
    setShopQuery("sort", value);
    setShowMenu(false);
  }
  return (
    <div className="relative">
      <ProductsSortingOption
        sort={shopQuery.sort || "Default sorting"}
        ShowFilterMenu={ShowFilterMenu}
      />
      {showMenu && (
        <DropDownMenu
          onSelect={onSelect}
          results={sortingArray}
          className="w-[200%] overflow-y-clip left-[-50%] max-h-auto"
          ref={MenuRef}
        />
      )}
    </div>
  );
}
