export default function LogoutSection({ onLogout }) {
  return (
    <div className="border-t border-zinc-200">
      <button
        onClick={onLogout}
        className=" w-full text-start px-6 py-4 text-red-500 hover:bg-red-50 transition "
      >
        <span>🚪</span>
        <span className="text-sm font-light">Sign Out</span>
      </button>
    </div>
  );
}
