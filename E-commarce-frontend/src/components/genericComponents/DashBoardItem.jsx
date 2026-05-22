import ProcessStatus from "./ProcessStatus";
function DashBoardItem({ items , orderId , status , statusColor ,  createdAt , totalPrice }) {
  return (
    <div
      className={`flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6
                     border-b border-zinc-200 last:border-b-0
                     hover:bg-zinc-50 cursor-pointer active:bg-zinc-100`}
    >
      {/* Left */}
      <div className="min-w-0 flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="max-w-full truncate text-sm font-light text-[#272727]">
            #{orderId}
          </span>

          <ProcessStatus status={status} statusColor={statusColor} />
        </div>

        {items &&
          items.map((item) => (
            <span key={item._id} className="flex min-w-0 flex-wrap gap-x-1 text-sm text-zinc-500">
              <p className="line-clamp-1 max-w-full sm:max-w-xs">{item.name}</p>
              <p className="line-clamp-1">X {item.price}</p>
              <p className="line-clamp-1">X {item.quantity}</p>
            </span>
          ))}
      </div>

      {/* Right */}
      <div className="shrink-0 text-left sm:text-right">
        <div className="text-[#272727] font-light">
          {totalPrice.toLocaleString()}
        </div>

        <div className="text-sm text-zinc-500">{createdAt}</div>
      </div>
    </div>
  );
}

export default DashBoardItem;
