import AccountSidebar from "../../../components/AccountSideBar/AccountSidebar";
import NavItem from "../../../components/AccountSideBar/NavItem";
import LogoutSection from "../../../components/AccountSideBar/LogoutSection";
export default function UserSidebar({ items, activeId, onClick, onLogout }) {
  return (
    <AccountSidebar>
      <div className="mt-5 ">
        {items.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeId === item.id}
            onClick={onClick}
          />
        ))}
      </div>

      <LogoutSection onLogout={onLogout} />
    </AccountSidebar>
  );
}
