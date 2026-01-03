export default function ProductRow({ image, title, price, oldPrice }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-zinc-200 last:border-b-0">
      {/* Image */}
      <div className="w-14 h-14">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <p className="text-[21px] font-light text-[#272727] leading-tight whitespace-nowrap">
          {title}
        </p>

        <div className="flex items-center gap-2">
          {oldPrice && (
            <span className="text-sm text-zinc-400 line-through">
              ${oldPrice}
            </span>
          )}
          <span className="text-[#FF6543] font-light text-[18px]">
            ${price}
          </span>
        </div>
      </div>
    </div>
  );
}
