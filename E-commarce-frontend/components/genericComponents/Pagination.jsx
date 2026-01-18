import {Fragment } from "react";
export default function Pagination({
  totalPages,
  RangeOfPagesNumberToShow,
  currentPage,
  onChange,
}) {
  
  function NextPage() {
    onChange(currentPage + 1);
  }
  function PrevPage() {
    onChange(currentPage - 1);
  }
  function AnyNumberPressed(pageNumber) {
    onChange(pageNumber);
  }
  console.log(currentPage);
  return (
    <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
      <button
        onClick={PrevPage}
        disabled={currentPage === 1}
        className="hover:text-[#FF6543] disabled:opacity-40 cursor-pointer"
      >
        Prev
      </button>

      {Array.from({ length: RangeOfPagesNumberToShow + 2 }).map((_, i) => {
        const page = i + currentPage;
        
        return (
           <Fragment key={`pagination-fragment-${page}-${i}`}>
            {(page <= totalPages && i !== RangeOfPagesNumberToShow) ||
            (page === totalPages + 1 && i === RangeOfPagesNumberToShow + 1) ? (
              <button
                onClick={() => AnyNumberPressed(i == RangeOfPagesNumberToShow + 1 ? totalPages : page)}
                className={`
              ${
                page === currentPage ? "text-[#FF6543]" : "hover:text-[#FF6543]"
              }
                 cursor-pointer
              `}
              >
                {i == RangeOfPagesNumberToShow + 1 ? totalPages : page}
              </button>
            ) : (
              RangeOfPagesNumberToShow + currentPage < totalPages + 1 &&
              i === RangeOfPagesNumberToShow && <p>...</p>
            )}
           </Fragment>
        );
      })}

      <button
        onClick={NextPage}
        disabled={currentPage === totalPages}
        className="hover:text-[#FF6543] disabled:opacity-40 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
