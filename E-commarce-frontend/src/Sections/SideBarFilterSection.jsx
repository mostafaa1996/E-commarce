import SideBarFilter from "@/components/genericComponents/SideBarFilter";
import { useShopQueryStore } from "@/zustand_ShopPage/ShopQueryStore";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";


export default function SideBarFilterSection({ products }) {
  const { shopQuery, setShopQuery , resetAll } = useShopQueryStore();
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  const HandleMaxMinPrice = () => {
    if (
      products.price &&
      Array.isArray(products.price) &&
      products.price.length > 0
    ) {
      //sort the array
      const sortedArray = products.price.sort((a, b) => a - b);
      //Max and Min array
      const max = sortedArray[sortedArray.length - 1];
      const min = sortedArray[0];
      const range = max - min;
      const step = Math.ceil(range / 5);
      const RangePriceArr = [];
      for (let i = 0; i < 5; i++) {
        const start = min + i * step;
        const end = Math.min(max, start + step - 1);
        RangePriceArr.push({
          min: start,
          max: end,
        });
      }
      return RangePriceArr;
    }
  };

  let PriceArr = HandleMaxMinPrice();
  PriceArr = PriceArr?.map((item) => {
    return {
      label: `${format(item.min * rate)}-${format(item.max * rate)}`,
      value: { min: item.min, max: item.max },
    };
  });

  const FilterationData = {
    categories: products?.category,
    tags: products?.tags,
    brands: products?.brands,
    Price: PriceArr?.map((item) => item.label),
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
      setShopQuery(Title, data); //set the data to the title
      return;
    } else if (!Array.isArray(shopQuery[Title])) {
      if (shopQuery[Title] === item) {
        if(Title === "category" ) {
          resetAll();
          return;
        }
        setShopQuery(Title, null);
        return;
      }
      if (Title === "price") {
        const maxPrice = PriceArr.find((price) => price.label === item).value
          .max;
        const minPrice = PriceArr.find((price) => price.label === item).value
          .min;
        // toggle the filter
        if (
          shopQuery["minPrice"] === minPrice &&
          shopQuery["maxPrice"] === maxPrice
        ) {
          setShopQuery("minPrice", null);
          setShopQuery("maxPrice", null);
          return;
        }
        setShopQuery("minPrice", minPrice);
        setShopQuery("maxPrice", maxPrice);
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
            />
          );
        })}
    </>
  );
}
