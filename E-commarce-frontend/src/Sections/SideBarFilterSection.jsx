import SideBarFilter from "@/components/genericComponents/SideBarFilter";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useShopQuery from "@/hooks/shopPageQuery";
import { Fragment } from "react";

export default function SideBarFilterSection({ data }) {
  const { updateShopQuery, shopQuery, resetShopQuery } = useShopQuery();
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const HandleMaxMinPrice = () => {
    if (data.price && Array.isArray(data.price) && data.price.length > 0) {
      //sort the array
      const sortedArray = data.price.sort((a, b) => a - b);
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

  function PrepareActivatedFilters() {
    const query = {
      category: shopQuery.category,
      tags: shopQuery.tags,
      brands: shopQuery.brands,
      price: PriceArr?.find(
        (item) =>
          item.value.min === shopQuery.minPrice &&
          item.value.max === shopQuery.maxPrice,
      )?.label,
    };
    console.log(query);
    return query;
  }

  const FilterationData = {
    categories: data?.category,
    tags: data?.tags,
    brands: data?.brands,
    Price: PriceArr?.map((item) => item.label),
  };

  function applyFilter(Title, item) {
    if (Array.isArray(shopQuery[Title])) {
      const data = shopQuery[Title];
      // check if the item is already in the array
      if (!data.includes(item)) {
        data.push(item); // add the item
      } else {
        data.splice(data.indexOf(item), 1); // remove the item
      }
      if (data.length === 0) {
        updateShopQuery({ [Title]: [] }); // if the array is empty, set the value to empty array
        return;
      }
      updateShopQuery({ [Title]: data }); //set the data to the title
      return;
    } else if (!Array.isArray(shopQuery[Title])) {
      if (shopQuery[Title] === item) {
        if (Title === "category") {
          resetShopQuery();
          return;
        }
        updateShopQuery({ [Title]: null });
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
          updateShopQuery({ minPrice: null, maxPrice: null });
          return;
        }
        updateShopQuery({ minPrice: minPrice, maxPrice: maxPrice });
        return;
      }
    }
    updateShopQuery({ [Title]: item });
  }

  return (
    <>
      {/* the essential filter is categories */}
      {FilterationData.categories && (
        <SideBarFilter
          title={"Category"}
          items={FilterationData.categories || []}
          onSelectFilter={applyFilter}
          activeFilter={PrepareActivatedFilters()}
        />
      )}
      {/* the rest of the filters determined by the categories selected */}
      {shopQuery.category &&
        Object.entries(FilterationData).map(([key, values]) => {
          if (key === "categories") return;
          return (
            <Fragment key={key}>
              <SideBarFilter
                title={key}
                items={values || []}
                onSelectFilter={applyFilter}
                activeFilter={PrepareActivatedFilters()}
              />
            </Fragment>
          );
        })}
    </>
  );
}
