import clsx from "clsx";
import { brands } from "../../Data/brands";
export default function Brands() {
  return (
    <div className="w-full border-y-1 border-gray-100 bg-[#fafafa] py-10">
      <nav className="mx-auto flex md:flex-row flex-col max-w-5xl items-center justify-center gap-20">
        {brands.map((brand) => (
          <p
            key={brand.name}
            className={clsx(
              "uppercase tracking-[0.1em] text-[#C1C1C1]",
              brand.font,
              brand.style,
              brand.size
            )}
          >
            {brand.name}
          </p>
        ))}
      </nav>
    </div>
  );
}
