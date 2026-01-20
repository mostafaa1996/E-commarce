import SideBarFilter from "../../components/genericComponents/SideBarFilter";
import { useShopQueryStore } from "../ShopPageData/ShopQueryStore";


export default function SideBarFilterSection({products}) {
  const { shopQuery, setShopQuery } = useShopQueryStore();
 
  const FilterationData = {
    categories: products.category,
    tags: products.tags,
    brands: products.brands,
    Price: products.price,
  };

  function applyFilter(item, Title) {
    if (Array.isArray(shopQuery[Title])) {
      const data = shopQuery[Title];
      if (!data.includes(item)) {
        data.push(item);
      } else {
        data.splice(data.indexOf(item), 1);
      }
      if (data.length === 0) {
        setShopQuery(Title, null);
        return;
      }
      setShopQuery(Title, data);
      return;
    } else if (!Array.isArray(shopQuery[Title])) {
      if (shopQuery[Title] === item) {
        setShopQuery(Title, null);
        return;
      }
    }
    setShopQuery(Title, item);
  }
  
  return (
    <>
      {/* the essential filter is categories */}
      {FilterationData.categories && <SideBarFilter
        key={FilterationData.categories[0]}
        title={"Category"}
        items={FilterationData.categories}
        applyFilter={applyFilter}
        MultiChoiceOption={false}
      />}
      {/* the rest of the filters determined by the categories selected */}
      {shopQuery.category &&
        Object.entries(FilterationData).map(([key , values, index]) => {
          if (index === 0) return;
          return (
            <SideBarFilter
              key={key}
              title={key}
              items={values}
              applyFilter={applyFilter}
              MultiChoiceOption={Array.isArray(shopQuery[key])}
            />
          );
        })}
    </>
  );
}
