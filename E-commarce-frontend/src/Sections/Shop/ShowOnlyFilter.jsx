import { Label } from "@/components/genericComponents/Label";
import { CheckBox } from "@/components/genericComponents/CheckBox";

const showOnlyFilters = [
  { key: "onDeal", label: "Deals" },
  { key: "topRated", label: "Top Rated" },
  { key: "bestSeller", label: "Best Seller" },
];

export default function ShowOnlyFilter({ selectedFilters, onToggle }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Show Only
        </h3>
        <div className="mt-1 h-px w-full bg-gradient-to-r from-border to-transparent" />
      </div>
      {showOnlyFilters.map((filter) => (
        <label
          key={`${filter.key}-${filter.label}-sidebar-filter`}
          className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <CheckBox
            checked={Boolean(selectedFilters[filter.key])}
            onCheckedChange={() => onToggle(filter.key)}
          />
          <Label className="cursor-pointer">{filter.label}</Label>
        </label>
      ))}
    </div>
  );
}
