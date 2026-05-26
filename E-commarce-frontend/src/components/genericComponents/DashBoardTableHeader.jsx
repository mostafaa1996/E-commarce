export default function DashBoardTableHeader({ ButtonAction , HeaderIcon , HeaderText , ButtonContent }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 text-[#272727]">
        <span className="text-[#FF6543]">{HeaderIcon}</span>
        <h3 className="truncate text-lg font-bold sm:text-[21px]">{HeaderText}</h3>
      </div>

      <button
        onClick={ButtonAction}
        className="
          shrink-0
          text-sm
          text-[#FF6543]
          hover:underline
        "
      >
        {ButtonContent.position === "right" ? (
          <div className="flex items-center gap-1">
            <p className="text-[#FF6543]">{ButtonContent.text}</p>
            <span className="text-[#FF6543]">{ButtonContent.icon}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-[#FF6543]">{ButtonContent.icon}</span>
            <p className="text-[#FF6543]">{ButtonContent.text}</p>
          </div>
        )}
      </button>
    </div>
  );
}
