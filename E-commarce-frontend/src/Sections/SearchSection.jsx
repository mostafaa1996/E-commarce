import SearchBar from "@/components/genericComponents/SearchBox";
import DropdownMenu from "@/components/genericComponents/DropDownMenu";
import { useShopSearchStore } from "@/zustand_ShopPage/shopSearchStore";
import { useQuery } from "@tanstack/react-query";
import { getLimitedSearchedProducts } from "@/APIs/shopProductsService";
import { useEffect, useRef , useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SearchSection() {
  let content = null;
  const {
    searchValue,
    setShopSearchValue,
    submittedSearchValue,
    setSubmittedSearchValue,
  } = useShopSearchStore();
  const [openMenu, setOpenMenu] = useState(false);
  const debounceRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  //use query for suggestions in menu under search bar
  const {
    data: shopSearch,
    isLoading: shopSearchLoading,
    error: shopSearchError,
  } = useQuery({
    queryKey: ["shopSearch", searchValue],
    queryFn: () => getLimitedSearchedProducts({ search: searchValue }),
    enabled: searchValue !== "" && searchValue !== null,
    staleTime: 1000 * 5,
  });

  useEffect(() => {
    function handleMouseDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  function SearchValueChangeEvent(currentValue) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setShopSearchValue(currentValue);
    }, 300);
  }
  function SearchSubmitEvent(value) {
    if (value === "") {
      setSubmittedSearchValue("");
      setShopSearchValue("");
      return;
    }
    setSubmittedSearchValue(value);
    navigate(`/products/search/${value}`);
  }
  function SearchDropDownMenuSelectEvent(id) {
    navigate(`products/${id}`);
  }
  if (shopSearchLoading || shopSearchError || shopSearch?.length === 0) {
    content = <DropdownMenu ref = {menuRef} results={[]} />;
  }
  if (shopSearch && Array.isArray(shopSearch)) {
    content = (
      <DropdownMenu
        results={shopSearch}
        onSelect={SearchDropDownMenuSelectEvent}
        ref = {menuRef}
      />
    );
  }
  return (
    <div className="relative">
      <SearchBar
        onChange={SearchValueChangeEvent}
        onClickSearch={SearchSubmitEvent}
        onFocus={() => setOpenMenu(true)}
        placeholder="Search..."
      />
      {openMenu && content}
    </div>
  );
}
