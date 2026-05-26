import SideBarFilter from "@/components/genericComponents/SideBarFilter";
import PriceFilter from "@/Sections/Shop/PriceFilter";
import ShowOnlyFilter from "@/Sections/Shop/ShowOnlyFilter";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { useMemo, useState, useEffect } from "react";
import useShopFilters  from "@/hooks/useShopFilters";

export default function SideBarFilterSection({ data }) {
  const {
    shopQuery: MainQuery,
    toggleArrayFilter,
    toggleSingleFilter,
    toggleCategoryFilter,
    toggleBooleanFilter,
    setPriceFilter
  } = useShopFilters();
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const [draftUiPriceRange, setDraftUiPriceRange] = useState([0, 0]);
  const [isPriceSliderMoved, setIsPriceSliderMoved] = useState(false);
  const maxPrice = useMemo(() => {
    if (!Array.isArray(data?.price) || data.price.length === 0) {
      return null;
    }

    return Math.max(...data.price);
  }, [data?.price]);
  const defaultPriceRange = useMemo(
    () => [0, (maxPrice ?? 0) * rate],
    [maxPrice, rate],
  );
  const visiblePriceRange = isPriceSliderMoved
    ? draftUiPriceRange
    : defaultPriceRange;

  const filterGroups = [
    {
      key: "category",
      title: "Category",
      items: data?.category || [],
      selected: MainQuery.category,
    },
    {
      key: "tags",
      title: "Tags",
      items: data?.tags || [],
      selected: MainQuery.tags,
      visible: Boolean(MainQuery.category),
    },
    {
      key: "brands",
      title: "Brands",
      items: data?.brands || [],
      selected: MainQuery.brands,
      visible: Boolean(MainQuery.category),
    },
  ];

  useEffect(() => {
    if (!isPriceSliderMoved) return;

    const timeoutId = setTimeout(() => {
      setPriceFilter({
        minPrice: draftUiPriceRange[0] / rate,
        maxPrice: draftUiPriceRange[1] / rate,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [draftUiPriceRange, isPriceSliderMoved, rate , setPriceFilter]);

  function applyFilter(Title, item) {
    if (Array.isArray(MainQuery[Title])) {
      toggleArrayFilter(Title, item);
      return;
    } else {
      if (Title === "category") {
        toggleCategoryFilter(item);
        return;
      }
      toggleSingleFilter(Title, item);
    }
  }

  return (
    <>
      {filterGroups
        .filter((group) => group.visible !== false)
        .map((group) => (
          <SideBarFilter
            key={group.key}
            title={group.title}
            items={group.items}
            selected={group.selected}
            onSelectFilter={(item) => applyFilter(group.key, item)}
          />
        ))}
      {MainQuery.category && (
        <PriceFilter
          value={visiblePriceRange}
          max={(maxPrice ?? 0) * rate}
          format={format}
          onChange={(nextRange) => {
            setIsPriceSliderMoved(true);
            setDraftUiPriceRange(nextRange);
          }}
        />
      )}
      {MainQuery.category && (
        <ShowOnlyFilter
          selectedFilters={MainQuery}
          onToggle={(key) => toggleBooleanFilter(key)}
        />
      )}
    </>
  );
}
