import SideBarFilter from "../../components/genericComponents/SideBarFilter";
import { useShopQueryStore } from "../ShopQueryStore";
import { useEffect } from "react";

const Data = {
  categories: ["Laptops", "Phones", "Tablets"],
  tags: ["Laptops", "Phones", "Tablets"],
  brands: ["Facebook", "Instagram", "Twitter"],
};

export default function SideBarFilterSection() {
  const { shopQuery, setQuery } = useShopQueryStore();
  useEffect(() => {
    console.log(shopQuery);
  }, [shopQuery]);
  function applyFilter(item, Title) {
    if (Array.isArray(shopQuery[Title])) {
      const data = shopQuery[Title];
      if (!data.includes(item)) {
        data.push(item);
      } else {
        data.splice(data.indexOf(item), 1);
      }
      setQuery(Title, data);
      return;
    }
    else if (!Array.isArray(shopQuery[Title])) {
      if (shopQuery[Title] === item) {
        setQuery(Title, null);
        return;
      }
    }
    setQuery(Title, item);
  }
  return (
    <>
      {Object.entries(Data).map(([category, items]) => (
        <SideBarFilter
          key={category}
          title={category}
          items={items}
          applyFilter={applyFilter}
        />
      ))}
    </>
  );
}
