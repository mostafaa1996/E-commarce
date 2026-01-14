import SearchBar from "../../components/genericComponents/SearchBox";
import DropdownMenu from "../../components/genericComponents/DropDownMenu";
import { useEffect } from "react";
import { useState } from "react";
import { useShopSearchStore } from "../shopSearchStore";
import { useShopQueryStore } from "../shopQueryStore";
export default function SearchSection() {
  const [searchValue, setSearchValue] = useState("");
  const { shopSearch, setShopSearchValue , setShopSearchProducts } = useShopSearchStore();
  const { shopQuery, setShopQuery } = useShopQueryStore();
  // useEffect(() => {
  //   console.log(shopQuery);
  //   console.log(shopSearch);
  // }, [shopQuery, shopSearch]);
  useEffect(() => {
    const t = setTimeout(() => {
      setShopSearchValue(searchValue.trim());
    }, 500);

    return () => clearTimeout(t);
  }, [searchValue, setShopSearchValue]);

  function SearchValueChangeEvent(currentValue) {
    setSearchValue(currentValue.trim());
  }
  function SearchSubmitEvent(value) {
    setShopQuery("search", value.trim());
    setSearchValue("");
    setShopSearchValue("");
    setShopSearchProducts([]);
  }
  function SearchDropDownMenuSelectEvent(title) {
    SearchSubmitEvent(title);
  }
  return (
    <div className="relative">
      <SearchBar
        onChange={SearchValueChangeEvent}
        onClickSearch={SearchSubmitEvent}
        placeholder="Search..."
      />
      {shopSearch.products && (
        <DropdownMenu
          results={shopSearch.products}
          onSelect={SearchDropDownMenuSelectEvent}
        />
      )}
    </div>
  );
}
