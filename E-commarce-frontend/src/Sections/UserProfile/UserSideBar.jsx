import AccountSidebar from "../../../components/AccountSideBar/AccountSidebar";
import NavItem from "../../../components/AccountSideBar/NavItem";
import LogoutSection from "../../../components/AccountSideBar/LogoutSection";
import { useState } from "react";
export default function UserSidebar({ items, activeId, onLogout }) {
  const [active, setActive] = useState(activeId);
  return (
    <AccountSidebar>
      <div className="mt-5 ">
        {items.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={active === item.id}
            onClick={() => {
              setActive(item.id);
              item.Action();
            }}
          />
        ))}
      </div>

      <LogoutSection onLogout={onLogout} />
    </AccountSidebar>
  );
}
