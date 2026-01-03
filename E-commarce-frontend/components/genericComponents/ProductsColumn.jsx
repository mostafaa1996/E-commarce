import ProductRow from "./ProductCard_H";
export default function ProductColumn({ title, items }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6">
      {/* Column title */}
      <h3 className="text-[30px] font-extralight text-[#272727] uppercase">
        {title}
      </h3>

      {/* Decorative divider */}
      <div
        className="mt-2 mb-6 h-[10px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #D4D4D4 0 2px, transparent 2px 10px)",
        }}
      />

      {/* Items */}
      <div>
        {items.map((item) => (
          <ProductRow
            key={item.title}
            image={item.image}
            title={item.title}
            price={item.price}
            oldPrice={item.oldPrice}
          />
        ))}
      </div>
    </div>
  );
}