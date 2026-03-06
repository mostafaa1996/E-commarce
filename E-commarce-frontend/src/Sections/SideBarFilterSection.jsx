import SideBarFilter from "@/components/genericComponents/SideBarFilter";
import { useShopQueryStore } from "@/zustand_ShopPage/ShopQueryStore";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";

export default function SideBarFilterSection({ products }) {
  const { shopQuery, setShopQuery } = useShopQueryStore();
  const { currency, locale , conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1 ;

  const FilterationData = {
    categories: products?.category,
    tags: products?.tags,
    brands: products?.brands,
    Price: products?.price.map((price) => format(price * rate)),
  };

  function applyFilter(item, Title) {
    if (Array.isArray(shopQuery[Title])) {
      const data = shopQuery[Title];
      // check if the item is already in the array
      if (!data.includes(item)) {
        data.push(item); // add the item
      } else {
        data.splice(data.indexOf(item), 1); // remove the item
      }
      if (data.length === 0) {
        setShopQuery(Title, null); // if the array is empty, set the value to null
        return;
      }
      setShopQuery(Title, data); // if the array is not empty, set the value to the array
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
      {FilterationData.categories && (
        <SideBarFilter
          key={FilterationData.categories[0]}
          title={"Category"}
          items={FilterationData.categories || []}
          applyFilter={applyFilter}
          MultiChoiceOption={false}
        />
      )}
      {/* the rest of the filters determined by the categories selected */}
      {shopQuery.category &&
        Object.entries(FilterationData).map(([key, values]) => {
          if (key === "categories") return;
          return (
            <SideBarFilter
              key={key}
              title={key}
              items={values || []}
              applyFilter={applyFilter}
              MultiChoiceOption={Array.isArray(shopQuery[key])}
            />
          );
        })}
    </>
  );
}
