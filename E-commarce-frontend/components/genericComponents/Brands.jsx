import clsx from "clsx";
const brands = [
     {name:"TECHLIGHT" , font:"roboto" , style : "font-light" , size:"text-[33.74px]"} 
    ,{name:"MiniStore.", font:"jost" , style : "font-regular", size:"text-[45px]"}
    ,{name:"ULTRAS"    , font:"inter" , style : "font-extrabold", size:"text-[37.74px]"}
    ,{name:"SWANKY"    , font:"syne"  , style : "font-bold", size:"text-[33.74px]"}
    ,{name:"EMILY"     , font:"lora"  , style : "font-regular", size:"text-[33.74px]"}
];
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
