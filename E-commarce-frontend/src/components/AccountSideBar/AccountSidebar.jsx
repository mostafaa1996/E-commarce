export default function AccountSidebar({ children }) {
  return (
    <aside
      className={`h-fit w-full border border-zinc-200 rounded-xl lg:max-w-xs
                 bg-white overflow-hidden mb-5`}
    >
      {children}
    </aside>
  );
}
