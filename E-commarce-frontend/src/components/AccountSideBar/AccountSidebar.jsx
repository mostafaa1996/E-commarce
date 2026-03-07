export default function AccountSidebar({ children }) {
  return (
    <aside
      className={`w-full max-w-xs h-fit border border-zinc-200 rounded-xl
                 bg-white overflow-hidden mb-5`}
    >
      {children}
    </aside>
  );
}
