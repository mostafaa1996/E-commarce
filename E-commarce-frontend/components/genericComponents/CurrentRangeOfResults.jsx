export default function CurrentRangeOfResults({ from, to, total}) {
  return (
    <div className="text-sm text-zinc-500">
      <span>
        Showing {from}–{to} of {total} results
      </span>
    </div>
  );
}

