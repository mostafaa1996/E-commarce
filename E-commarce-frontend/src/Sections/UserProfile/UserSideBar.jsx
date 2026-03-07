import AccountSidebar from "@/components/AccountSideBar/AccountSidebar";
import NavItem from "@/components/AccountSideBar/NavItem";
import LogoutSection from "@/components/AccountSideBar/LogoutSection";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/system/icons/Icon";
export default function UserSidebar({ items, activeId, onLogout }) {
  const [active, setActive] = useState(activeId);
  const navigate = useNavigate();
  return (
    <AccountSidebar>
      <div className="mt-5 ">
        {items.map((item) => (
          <NavItem
            key={item.id}
            icon={
              <Icon
                name={item.icon}
                size={24}
                strokeWidth={1.5}
                variant="primary"
              />
            }
            label={item.label}
            active={active === item.id}
            onClick={() => {
              setActive(item.id);
              navigate(item.path);
            }}
          />
        ))}
      </div>

      <LogoutSection onLogout={onLogout} />
    </AccountSidebar>
  );
}
