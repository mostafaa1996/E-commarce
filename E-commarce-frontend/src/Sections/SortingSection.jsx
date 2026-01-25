import DropDownMenu from "../../components/genericComponents/DropDownMenu";
import ProductsSortingOption from "../../components/genericComponents/ProductsSortingOption";
import { useShopQueryStore } from "../zustand_ShopPage/ShopQueryStore";
import { useShopSortingStore } from "../zustand_ShopPage/ShopSortingStore";
import { useState } from "react";
// import { useEffect } from "react";
export default function SortingSection() {
  const [showMenu, setShowMenu] = useState(false);
  const { shopQuery, setShopQuery } = useShopQueryStore();
  const { shopSorting, setShopSortingTrigger } = useShopSortingStore();
  // useEffect(() => {
  //   console.log(shopSorting.trigger);
  // }, [shopSorting.trigger]);
  function ShowFilterMenu() {
    setShowMenu(!showMenu);
    setShopSortingTrigger(!shopSorting.trigger);
  }
  function onSelect(value) {
    setShopQuery("sort", value);
    setShopSortingTrigger(false);
    setShowMenu(false);
  }
  return (
    <div className="relative">
      <ProductsSortingOption
        sort={shopQuery.sort || "Default sorting"}
        ShowFilterMenu={ShowFilterMenu}
      />
      {showMenu && (
        <DropDownMenu onSelect={onSelect} results={shopSorting.SortingArray} />
      )}
    </div>
  );
}
