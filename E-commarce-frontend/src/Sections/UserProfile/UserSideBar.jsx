import AccountSidebar from "@/components/AccountSideBar/AccountSidebar";
import NavItem from "@/components/AccountSideBar/NavItem";
import LogoutSection from "@/components/AccountSideBar/LogoutSection";
import useProfileRoutingStates from "@/zustand_ProfileRoutesStates/ProfileRoutesStates";

import { useNavigate } from "react-router-dom";
import Icon from "@/system/icons/Icon";
export default function UserSidebar({ items,onLogout }) {
  const { setCurrentRouteState , currentRouteState } = useProfileRoutingStates();
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
            active={currentRouteState.currentRoute === item.id}
            onClick={() => {
              setCurrentRouteState({...currentRouteState , currentRoute : item.id});
              navigate(item.path);
            }}
          />
        ))}
      </div>

      <LogoutSection onLogout={onLogout} />
    </AccountSidebar>
  );
}
