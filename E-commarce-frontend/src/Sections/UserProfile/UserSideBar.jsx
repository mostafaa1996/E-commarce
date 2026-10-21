import AccountSidebar from "@/components/AccountSideBar/AccountSidebar";
import NavItem from "@/components/AccountSideBar/NavItem";
import LogoutSection from "@/components/AccountSideBar/LogoutSection";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import Icon from "@/system/icons/Icon";
export default function UserSidebar({ items, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <AccountSidebar>
      <div className="flex gap-1 overflow-x-auto p-2 lg:mt-5 lg:block lg:overflow-visible lg:p-0">
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
            active={item.path === location.pathname}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      <LogoutSection onLogout={onLogout} />
    </AccountSidebar>
  );
}
