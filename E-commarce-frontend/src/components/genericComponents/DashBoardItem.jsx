import ProcessStatus from "./ProcessStatus";
function DashBoardItem({ items , orderId , status , statusColor ,  createdAt , totalPrice }) {
  return (
    <div
      className={`flex items-start justify-between px-6 py-5 
                     border-b border-zinc-200 last:border-b-0
                     hover:bg-zinc-50 cursor-pointer active:bg-zinc-100`}
    >
      {/* Left */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-light text-[#272727]">
            #{orderId}
          </span>

          <ProcessStatus status={status} statusColor={statusColor} />
        </div>

        {items &&
          items.map((item) => (
            <span key={item._id} className="flex text-sm text-zinc-500 gap-1">
              <p className="line-clamp-1 max-w-xs">{item.name}</p>
              <p className="line-clamp-1">X ${item.price}</p>
              <p className="line-clamp-1">X {item.quantity}</p>
            </span>
          ))}
      </div>

      {/* Right */}
      <div className="text-right">
        <div className="text-[#272727] font-light">
          ${totalPrice.toLocaleString()}
        </div>

        <div className="text-sm text-zinc-500">{createdAt}</div>
      </div>
    </div>
  );
}

export default DashBoardItem;
