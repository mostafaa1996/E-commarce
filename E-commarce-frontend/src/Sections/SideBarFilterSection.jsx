import SideBarFilter from "@/components/genericComponents/SideBarFilter";
import { Slider } from "@/components/genericComponents/Slider";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useShopQuery from "@/hooks/shopPageQuery";
import { useState, useEffect } from "react";
import { Label } from "@/components/genericComponents/Label";
import { CheckBox } from "@/components/genericComponents/CheckBox";
import { useMemo } from "react";

export default function SideBarFilterSection({ data }) {
  const { updateShopQuery, shopQuery, resetShopQuery } = useShopQuery();
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(null);


  useEffect(() => {
    if (data.price && Array.isArray(data.price) && data.price.length > 0) {
      //sort the array
      const sortedArray = [...data.price].sort((a, b) => a - b);
      const nextMaxPrice = sortedArray[sortedArray.length - 1];

      if (nextMaxPrice === null) {
        setMaxPrice(null);
        setPriceRange([0, 0]);
        return;
      }
      setMaxPrice(nextMaxPrice);
      setPriceRange([0, nextMaxPrice * rate]);
    }
  }, [data, rate]);

  const activeFilters = useMemo(
    () => ({
      category: shopQuery.category,
      tags: shopQuery.tags,
      brands: shopQuery.brands,
    }),
    [shopQuery.category, shopQuery.tags, shopQuery.brands],
  );

  const FilterationData = {
    categories: data?.category,
    tags: data?.tags,
    brands: data?.brands,
    Price: priceRange,
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
        // reset the filter
        if (Title === "category") {
          resetShopQuery();
          return;
        }
        updateShopQuery({ [Title]: null });
        return;
      }
    }
    updateShopQuery({ [Title]: item });
  }

  function toggleFlag(flag) {
    
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateShopQuery({
        minPrice: priceRange[0] / rate,
        maxPrice: priceRange[1] / rate,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [priceRange, rate]);

  return (
    <>
      {/* the essential filter is categories */}
      {FilterationData.categories && (
        <SideBarFilter
          title={"Category"}
          items={FilterationData.categories || []}
          onSelectFilter={applyFilter}
          activeFilter={activeFilters}
        />
      )}
      {/* the rest of the filters determined by the categories selected */}
      {shopQuery.category &&
        Object.entries(FilterationData).map(([key, values]) => {
          if (key === "categories") return null;
          if (key === "Price")
            return (
              <div key={key} className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Show Only
                  </h3>
                  <div className="mt-1 h-px w-full bg-gradient-to-r from-border to-transparent" />
                </div>
                <div className="px-1 pt-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={(maxPrice ?? 0) * rate}
                    step={100}
                  />
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>{format(priceRange[0])}</span>
                    <span>{format(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            );
          return (
            <SideBarFilter
              key={key}
              title={key}
              items={values || []}
              onSelectFilter={applyFilter}
              activeFilter={activeFilters}
            />
          );
        })}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Show Only
          </h3>
          <div className="mt-1 h-px w-full bg-gradient-to-r from-border to-transparent" />
        </div>
        {[
          { key: "onDeal", label: "Deals" },
          { key: "topRated", label: "Top Rated" },
          { key: "bestSeller", label: "Best Seller" },
        ].map((f) => (
          <label
            key={`${f.key}-${f.label}-sidebar-filter`}
            className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <CheckBox
              checked={Boolean(shopQuery[f.key])}
              onCheckedChange={() => updateShopQuery({ [f.key]: !shopQuery[f.key] })}
            />
            <Label className="cursor-pointer">{f.label}</Label>
          </label>
        ))}
      </div>
    </>
  );
}
