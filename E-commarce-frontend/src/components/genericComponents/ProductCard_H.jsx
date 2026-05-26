import clsx from "clsx";

export default function ProductRow({ image, title, price, oldPrice, className }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 py-0 sm:gap-4 sm:py-4",
        "sm:border-b sm:border-zinc-200 sm:last:border-b-0",
        className,
      )}
    >
      {/* Image */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-50 sm:w-24">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-base font-light leading-tight text-[#272727] sm:line-clamp-1 sm:text-[21px]">
          {title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {oldPrice && (
            <span className="text-sm text-zinc-400 line-through">
              {oldPrice}
            </span>
          )}
          <span className="text-base font-light text-[#FF6543] sm:text-[18px]">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
