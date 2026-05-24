import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function CardMedia({
  Image,
  alt = "",
  badge,
  NavigationLink,
  className,
}) {
  const navigate = useNavigate();

  function handleClick() {
    if (!NavigationLink) {
      return;
    }

    navigate(NavigationLink);
  }

  return (
    <div
      className={twMerge(
        clsx(
          "relative h-50 w-50 border-b border-zinc-200 bg-white transition hover:scale-105",
          NavigationLink && "cursor-pointer",
          className,
        ),
      )}
      onClick={handleClick}
      role={NavigationLink ? "button" : undefined}
      tabIndex={NavigationLink ? 0 : undefined}
    >
      <img src={Image} alt={alt} className="h-full w-full object-contain" />

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
