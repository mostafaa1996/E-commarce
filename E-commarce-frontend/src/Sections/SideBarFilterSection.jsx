import SideBarFilter from "../../components/genericComponents/SideBarFilter";
import { useShopQueryStore } from "../ShopQueryStore";
// import { useEffect } from "react";

const Data = {
  categories: ["Laptops", "Phones", "Tablets"],
  tags: ["Laptops", "Phones", "Tablets"],
  brands: ["Facebook", "Instagram", "Twitter"],
};

export default function SideBarFilterSection() {
  const { shopQuery, setShopQuery } = useShopQueryStore();
  // useEffect(() => {
  //   console.log(shopQuery);
  // }, [shopQuery]);
  function applyFilter(item, Title) {
    if (Array.isArray(shopQuery[Title])) {
      const data = shopQuery[Title];
      if (!data.includes(item)) {
        data.push(item);
      } else {
        data.splice(data.indexOf(item), 1);
      }
      setShopQuery(Title, data);
      return;
    }
    else if (!Array.isArray(shopQuery[Title])) {
      if (shopQuery[Title] === item) {
        setShopQuery(Title, null);
        return;
      }
    }
    setShopQuery(Title, item);
  }
  return (
    <>
      {Object.entries(Data).map(([category, items]) => (
        <SideBarFilter
          key={category}
          title={category}
          items={items}
          applyFilter={applyFilter}
          MultiChoiceOption = {Array.isArray(shopQuery[category])}
        />
      ))}
    </>
  );
}
