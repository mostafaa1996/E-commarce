import lightstar from "/star.svg";
import dimmedStar from "/dimmedStar.svg";
export default function ReviewItem({ avatar, name, date, text , rating }) {
  return (
    <div className="flex gap-4 py-6 border-b border-[#E6E6E6] ml-10">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />

      <div className="flex flex-col gap-1">
        <span className="text-sm font-light text-[#272727]">
          {name} – {date}
        </span>

        <div className="flex items-center gap-1">
          {Array.from({ length: rating<=5?rating:5 }).map((_, i) => (
            <img key={`${i}-${name}-light`} src={lightstar} alt="star" className="w-6 h-6" />
          ))}
          {Array.from({ length: 5 - (rating<=5?rating:5) }).map((_, i) => (
            <img key={`${i}-${name}-dimmed`} src={dimmedStar} alt="star" className="w-6 h-6" />
          ))}
        </div>

        <p className="text-sm text-zinc-500">{text}</p>
      </div>
    </div>
  );
}
