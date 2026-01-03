export default function CurrentRangeOfResults({ from, to, total, sort = "Default sorting" , ShowFilterMenu}) {
  return (
    <div className="flex items-center justify-between text-sm text-zinc-500">
      <span>
        Showing {from}–{to} of {total} results
      </span>

      <button 
      onClick={ShowFilterMenu}
      className="flex items-center gap-1 hover:text-[#FF6543] cursor-pointer">
        {sort}
        <span>▾</span>
      </button>
    </div>
  );
}

