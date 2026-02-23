import TopFixedLayer from "../TopLayer/TopFixedLayer";
import BottomLayer from "../BottomLayer/BottomLayer";
import UserSidebar from "./UserSideBar";
import { UserSideBarItems } from "@/system/Data/UserSideBarData";

export default function BaseSection({ children }) {
  return (
    <>
      <TopFixedLayer Title="Profile" />
      <div className="grid lg:grid-cols-6 grid-cols-1 m-10 gap-3">
        <div className="hidden lg:block lg:col-span-1"></div>
        <UserSidebar items={UserSideBarItems} activeId="profile" />
        <div className="flex flex-col gap-5 lg:col-span-3">{children}</div>
      </div>
      <BottomLayer />
    </>
  );
}
