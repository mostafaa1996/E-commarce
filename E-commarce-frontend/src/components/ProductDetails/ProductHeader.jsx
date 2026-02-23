import ratingStar from "/ratingStar.svg";
export default function ProductHeader({ title, price, rating, description }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-[30px] font-extralight text-[#272727] line-clamp-1">
        {title}
      </h1>

      <span className="text-[#FF6543] text-[21px] font-light">${price}</span>
      <div className="flex flex-row items-center gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <img key={i} src={ratingStar} alt="star" />
        ))}
      </div>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
