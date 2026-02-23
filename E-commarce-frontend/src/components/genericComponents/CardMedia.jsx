export default function CardMedia({ Image , badge }) {
  return (
    <div className="relative bg-white w-50 h-50 ml-8">
      <img
        src={Image}
        alt=""
        className="w-full h-full object-contain"
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
