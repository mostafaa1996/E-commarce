import Icon from "@/system/icons/Icon";
export default function LogoutSection({ onLogout }) {
  return (
    <div className="border-t border-zinc-200">
      <button
        onClick={onLogout}
        className={`flex w-full cursor-pointer items-center justify-center gap-3 px-4 py-3 text-start text-sm font-light text-red-500
          transition hover:bg-red-50 hover:text-red-600 lg:justify-start lg:px-6 lg:py-4 lg:hover:scale-105 `}
      >
        <Icon name="logout" size={24} strokeWidth={1.5} variant="danger" />
        <span className="text-sm font-light">Sign Out</span>
      </button>
    </div>
  );
}
