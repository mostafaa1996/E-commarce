export default function ProductMeta({ sku, category, tags }) {
  return (
    <div className="text-sm text-zinc-500 flex flex-col gap-1 pt-4">
      <span>SKU: {sku}</span>
      <span>Category: {category}</span>
      <span>Tags: {tags.join(", ")}</span>
    </div>
  );
}
