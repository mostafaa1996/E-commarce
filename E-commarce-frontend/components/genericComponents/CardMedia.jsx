export default function CardMedia({ Image , badge }) {
  return (
    <div className="relative aspect-[4/3] bg-white">
      <img
        src={Image}
        alt=""
        className="w-full h-full object-cover"
      />

      {badge && (
        <span className="
          absolute top-3 left-3
          bg-[#FF6543]
          text-white
          text-xs
          px-2 py-1
        ">
          {badge}
        </span>
      )}
    </div>
  );
}
