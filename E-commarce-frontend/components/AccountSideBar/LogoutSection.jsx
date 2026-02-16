import Icon from "../../src/system/icons/Icon";
export default function LogoutSection({ onLogout }) {
  return (
    <div className="border-t border-zinc-200">
      <button
        onClick={onLogout}
        className={`w-full text-start px-6 py-4 text-red-500 hover:bg-red-50
          transition flex items-center gap-3 cursor-pointer text-sm font-light hover:text-red-600 hover:scale-105 `}
      >
        <Icon name="logout" size={24} strokeWidth={1.5} variant="danger" />
        <span className="text-sm font-light">Sign Out</span>
      </button>
    </div>
  );
}
