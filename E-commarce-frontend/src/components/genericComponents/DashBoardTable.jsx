import clsx from "clsx";
function DashBoardTable({ children , className }) {
  return (
    <div className={clsx(`border border-zinc-200  rounded-xl bg-white overflow-hidden`, className)}>
      {children}
    </div>
  );
}

export default DashBoardTable;
