export default function Pagination({ current, totalPages, RangeOfPagesNumberToShow, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="hover:text-[#FF6543] disabled:opacity-40"
      >
        Prev
      </button>

      {Array.from({ length: (RangeOfPagesNumberToShow + 2) }).map((_, i) => {
        const page = i + current;
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={
              page === current
                ? "text-[#FF6543]"
                : "hover:text-[#FF6543]"
            }
          >
            {i==RangeOfPagesNumberToShow? "..." : i==(RangeOfPagesNumberToShow+1)? totalPages : page}
          </button>
        );
      })}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
        className="hover:text-[#FF6543] disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
