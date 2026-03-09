import UserProfileCard from "@/Sections/UserProfile/UserProfileCard";
import StatsGrid from "@/Sections/UserProfile/My Profile/StatsGrid";
import OrderHistoryList from "@/Sections/UserProfile/My Profile/OrderList";
import AddressSection from "@/Sections/UserProfile/AddressSection";
import WishListSection from "@/Sections/UserProfile/WishListSection";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileData } from "@/APIs/UserProfileService";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import useProfileRoutingStates from "@/zustand_ProfileRoutesStates/ProfileRoutingStates";

export default function UserProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfileData,
  });

  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  return (
    <>
      <BaseSection>
        <UserProfileCard user={data?.contacts} />
        <StatsGrid stats={data?.StatsData} />
        <OrderHistoryList orders={data?.Orders} />
        <AddressSection addresses={data?.Addresses} />
        <WishListSection WishList={data?.wishlist} />
      </BaseSection>
    </>
  );
}
