import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import UserProfileCard from "../Sections/UserProfile/UserProfileCard";
import StatsGrid from "../Sections/UserProfile/StatsGrid";
import OrderHistoryList from "../Sections/UserProfile/OrderList";
import AddressSection from "../Sections/UserProfile/AddressSection";
import WishListSection from "../Sections/UserProfile/WishListSection";
import UserSidebar from "../Sections/UserProfile/UserSideBar";

const user = {
  name: "John Doe",
  memberSince: "January 2023",
  email: "john.doe@email.com",
  phone: "+1 234 567 890",
  location: "New York, USA",
  avatar: "/Man_avatar.png",
};

const statsData = [
  {
    id: "orders",
    icon: "🛍",
    value: 24,
    label: "Total Orders",
  },
  {
    id: "wishlist",
    icon: "❤️",
    value: 4,
    label: "Wishlist",
  },
  {
    id: "reviews",
    icon: "⭐",
    value: 12,
    label: "Reviews",
  },
  {
    id: "spent",
    icon: "💳",
    value: "$8,420",
    label: "Total Spent",
  },
];

const orders = [
  {
    id: "ORD-7291",
    status: "delivered",
    items: "iPhone 15 Pro Max, AirPods Pro",
    total: 1448,
    date: "Jan 15, 2025",
  },
  {
    id: "ORD-7185",
    status: "delivered",
    items: "MacBook Air M3, USB-C Hub",
    total: 1348,
    date: "Dec 28, 2024",
  },
  {
    id: "ORD-7042",
    status: "transit",
    items: "GoPro Hero 12 Black",
    total: 399,
    date: "Dec 10, 2024",
  },
  {
    id: "ORD-6891",
    status: "delivered",
    items: "Apple Watch Ultra 2",
    total: 799,
    date: "Nov 22, 2024",
  },
];

const addresses = [
  {
    id: 1,
    type: "Home",
    name: "John Doe",
    street: "123 Main Street, Apt 4B",
    city: "New York, NY 10001",
    isDefault: true,
  },
  {
    id: 2,
    type: "Office",
    name: "John Doe",
    street: "456 Business Ave, Floor 12",
    city: "New York, NY 10018",
    isDefault: false,
  },
];

const wishlist = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1099,
    image: "/iPhone_15_Pro_Max.png",
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: 999,
    image: "/MacBook_Air_M3.png",
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: 599,
    image: "/AirPods_Pro.png",
  },
];

  const navItems = [
    { id: "profile", label: "My Profile", icon: "👤" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "wishlist", label: "Wishlist", icon: "❤️" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "payments", label: "Payment Methods", icon: "💳" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

export default function UserProfilePage() {
  return (
    <>
      <TopFixedLayer Title="Profile" />
      <div className="grid lg:grid-cols-6 grid-cols-1 m-10">
        <div className="hidden lg:block lg:col-span-1"></div>
        <UserSidebar items={navItems} activeId="profile" />
        <div className="flex flex-col gap-10 lg:col-span-3">
          <UserProfileCard user={user} />
          <StatsGrid stats={statsData} />
          <OrderHistoryList orders={orders} />
          <AddressSection addresses={addresses} />
          <WishListSection WishList={wishlist} />
        </div>
      </div>
      <BottomLayer />
    </>
  );
}
