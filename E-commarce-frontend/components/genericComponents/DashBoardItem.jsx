import ProcessStatus from "./ProcessStatus";
function DashBoardItem({ order }) {
  return (
    <div className={`flex items-start justify-between px-6 py-5 
                     border-b border-zinc-200 last:border-b-0
                     hover:bg-zinc-50 cursor-pointer active:bg-zinc-100`}>
      {/* Left */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-light text-[#272727]">#{order.id}</span>

          <ProcessStatus status={order.status} />
        </div>

        <span className="text-sm text-zinc-500">{order.items}</span>
      </div>

      {/* Right */}
      <div className="text-right">
        <div className="text-[#272727] font-light">
          ${order.total.toLocaleString()}
        </div>

        <div className="text-sm text-zinc-500">{order.date}</div>
      </div>
    </div>
  );
}

export default DashBoardItem;
