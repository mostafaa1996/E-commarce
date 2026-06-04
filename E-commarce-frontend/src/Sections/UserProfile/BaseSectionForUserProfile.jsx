import { logoutAction } from "@/APIs/AuthService";
import UserSidebar from "./UserSideBar";
import { UserSideBarItems } from "@/system/Data/UserSideBarData";
import { useNavigate } from "react-router-dom";

export default function BaseSection({ children }) {
  const navigate = useNavigate();
  return (
    <div className="m-4 grid grid-cols-1 gap-4 sm:m-6 lg:m-10 lg:grid-cols-6">
      <div className="hidden lg:block lg:col-span-1"></div>
      <UserSidebar
        items={UserSideBarItems}
        onLogout={async () => {
          await logoutAction();
          navigate("/login");
        }}
      />
      <div className="flex flex-col gap-5 lg:col-span-3 justify-start">
        {children}
      </div>
    </div>
  );
}
