export default function Card({ children, className = "" }) {
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
      {children}
    </div>
  );
}
