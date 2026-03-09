import UserSidebar from "./UserSideBar";
import { UserSideBarItems } from "@/system/Data/UserSideBarData";

export default function BaseSection({ children }) {
  return (
    <div className="grid lg:grid-cols-6 grid-cols-1 m-10 gap-3">
      <div className="hidden lg:block lg:col-span-1"></div>
      <UserSidebar items={UserSideBarItems}  />
      <div className="flex flex-col gap-5 lg:col-span-3 justify-start">
        {children}
      </div>
    </div>
  );
}
