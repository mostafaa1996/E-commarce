import star from "/star.svg";
export default function ReviewCard({ Reviewtext, name, rating }) {
  return (
    <div className="border border-zinc-200 rounded-xl p-6 bg-white">
      <p className="sm:text-[21px] text-sm  text-zinc-600 font-extralight">
        “{Reviewtext}”
      </p>
      <div className="flex items-center gap-1 mt-4">
        {Array.from({ length: rating }).map((_, i) => (
          <img key={i} src={star} alt="star" />
        ))}
      </div>

      {/* Name */}
      <p className="mt-2 text-[21px] font-regular text-[#272727]">
        {name}
      </p>
    </div>
  );
}