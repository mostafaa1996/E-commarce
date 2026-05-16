import { Slider } from "@/components/genericComponents/Slider";

export default function PriceFilter({ value, max, format, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Price Range
        </h3>
        <div className="mt-1 h-px w-full bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="px-1 pt-2">
        <Slider
          value={value}
          onValueChange={onChange}
          min={0}
          max={max}
          step={100}
        />
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{format(value[0])}</span>
          <span>{format(value[1])}</span>
        </div>
      </div>
    </div>
  );
}
