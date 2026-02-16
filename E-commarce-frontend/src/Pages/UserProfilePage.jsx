import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import UserProfileCard from "../Sections/UserProfile/UserProfileCard";
import StatsGrid from "../Sections/UserProfile/StatsGrid";
import OrderHistoryList from "../Sections/UserProfile/OrderList";
import AddressSection from "../Sections/UserProfile/AddressSection";
import WishListSection from "../Sections/UserProfile/WishListSection";
import UserSidebar from "../Sections/UserProfile/UserSideBar";
import Icon from "../system/icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileData } from "../APIs/UserProfileService";
import { useNavigate } from "react-router-dom";


const user = {
  name: "John Doe",
  memberSince: "January 2023",
  email: "john.doe@email.com",
  phone: "+1 234 567 890",
  location: "New York, USA",
  avatar: "/Man_avatar.png",
};

export default function UserProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfileData,
  });

  const navigate = useNavigate();
  const navItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: <Icon name="user" size={24} strokeWidth={1.5} variant="primary" />,
    },
    {
      id: "orders",
      label: "Orders",
      icon: (
        <Icon name="orders" size={24} strokeWidth={1.5} variant="primary" />
      ),
      Action: () => navigate("/profile/orders"),
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: (
        <Icon name="wishlist" size={24} strokeWidth={1.5} variant="primary" />
      ),
      Action: () => navigate("/profile/wishlist"),
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: (
        <Icon name="location" size={24} strokeWidth={1.5} variant="primary" />
      ),
      Action: () => navigate("/profile/addresses"),
    },
    {
      id: "payments",
      label: "Payment Methods",
      icon: (
        <Icon name="payment" size={24} strokeWidth={1.5} variant="primary" />
      ),
      Action: () => navigate("/profile/payments"),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: (
        <Icon
          name="notifications"
          size={24}
          strokeWidth={1.5}
          variant="primary"
        />
      ),
      Action: () => navigate("/profile/notifications"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <Icon name="settings" size={24} strokeWidth={1.5} variant="primary" />
      ),
      Action: () => navigate("/profile/settings"),
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  return (
    <>
      <TopFixedLayer Title="Profile" />
      <div className="grid lg:grid-cols-6 grid-cols-1 m-10 gap-3">
        <div className="hidden lg:block lg:col-span-1"></div>
        <UserSidebar items={navItems} activeId="profile"/>
        <div className="flex flex-col gap-10 lg:col-span-3">
          <UserProfileCard user={data?.contacts} />
          <StatsGrid stats={data?.StatsData} />
          <OrderHistoryList orders={data?.Orders} />
          <AddressSection addresses={data?.Addresses} />
          <WishListSection WishList={data?.wishlist} />
        </div>
      </div>
      <BottomLayer />
    </>
  );
}
