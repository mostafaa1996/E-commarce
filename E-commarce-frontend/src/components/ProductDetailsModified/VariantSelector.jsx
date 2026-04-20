import { Check } from "lucide-react";

const VariantSelector = ({ variants = [], selected, onSelect }) => {
  if (!variants?.length) return null;

  // Derive option groups
  const colors = Array.from(new Map(variants.map((v) => [v.attributes.color?.name, v.attributes.color])).values()).filter(Boolean);
  const storages = Array.from(new Set(variants.map((v) => v.attributes.storage).filter(Boolean)));
  const sizes = Array.from(new Set(variants.map((v) => v.attributes.size).filter(Boolean)));
  const rams = Array.from(new Set(variants.map((v) => v.attributes.ram).filter(Boolean)));
  const ssds = Array.from(new Set(variants.map((v) => v.attributes.ssd).filter(Boolean)));

  const findVariant = (overrides) => {
    const target = { ...selected.attributes, ...overrides };
    return (
      variants.find(
        (v) =>
          v.attributes.color?.name === target.color?.name &&
          v.attributes.storage === target.storage &&
          v.attributes.size === target.size &&
          v.attributes.ram === target.ram &&
          v.attributes.ssd === target.ssd,
      ) ||
      variants.find((v) =>
        Object.entries(overrides).every(([k, val]) =>
          k === "color" ? v.attributes.color?.name === val?.name : v.attributes[k] === val,
        ),
      )
    );
  };

  const select = (key, val) => {
    const v = findVariant({ [key]: val });
    if (v) onSelect(v);
  };

  return (
    <div className="space-y-6">
      {colors.length > 1 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Color</span>
            <span className="text-sm font-medium text-foreground">{selected.attributes.color?.name}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => {
              const active = selected.attributes.color?.name === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => select("color", c)}
                  aria-label={c.name}
                  title={c.name}
                  className={`group relative grid h-11 w-11 place-items-center rounded-full border-2 transition-smooth ${
                    active ? "border-primary shadow-glow" : "border-border hover:border-foreground/40"
                  }`}
                >
                  <span className="block h-8 w-8 rounded-full border border-black/5" style={{ backgroundColor: c.hex }} />
                  {active && (
                    <Check className="absolute h-4 w-4" style={{ color: c.hex === "#F5F2EE" || c.hex === "#C5BFB6" ? "#000" : "#fff" }} strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {storages.length > 1 && (
        <PillGroup label="Storage" options={storages} value={selected.attributes.storage} onChange={(v) => select("storage", v)} />
      )}
      {sizes.length > 1 && <PillGroup label="Size" options={sizes} value={selected.attributes.size} onChange={(v) => select("size", v)} />}
      {rams.length > 1 && <PillGroup label="Memory" options={rams} value={selected.attributes.ram} onChange={(v) => select("ram", v)} />}
      {ssds.length > 1 && <PillGroup label="SSD" options={ssds} value={selected.attributes.ssd} onChange={(v) => select("ssd", v)} />}
    </div>
  );
};

const PillGroup = ({ label, options, value, onChange }) => (
  <div>
    <div className="mb-3 flex items-baseline justify-between">
      <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`min-w-[64px] rounded-xl border px-4 py-2.5 text-sm font-semibold transition-smooth ${
              active
                ? "border-primary bg-primary-soft text-primary shadow-sm"
                : "border-border bg-background text-foreground hover:border-foreground/30 hover:bg-secondary/60"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

export default VariantSelector;
