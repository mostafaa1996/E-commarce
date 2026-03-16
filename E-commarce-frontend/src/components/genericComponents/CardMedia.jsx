import { useNavigate } from "react-router-dom";
export default function CardMedia({ Image, badge , NavigationLink}) {
  const navigate = useNavigate();
  function handleClick() {
    navigate(NavigationLink);
  }
  return (
    <div
      className="relative bg-white w-50 h-50 cursor-pointer hover:scale-105 transition border-b border-zinc-200"
      onClick={handleClick}
      role="button"
    >
      <img src={Image} alt="" className="w-full h-full object-contain" />

      {badge && (
        <span
          className="
          absolute top-3 left-3
          bg-[#FF6543]
          text-white
          text-xs
          px-2 py-1
        "
        >
          {badge}
        </span>
      )}
    </div>
  );
}
