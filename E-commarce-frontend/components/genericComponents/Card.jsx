export default function Card({ image, children, className = "" }) {
  return (
    <div
      className={`
        bg-white
        border border-zinc-200
        rounded-xl
        overflow-hidden
        hover:shadow-lg
        transition
        ${className}
      `}
    >
      {/* Media */}
      <div className="aspect-[4/3] bg-zinc-100">
        <img
          src={image}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
