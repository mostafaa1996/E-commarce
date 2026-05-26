import UserProfileCard from "@/Sections/UserProfile/UserProfileCard";
import StatsGrid from "@/Sections/UserProfile/My Profile/StatsGrid";
import OrderHistoryList from "@/Sections/UserProfile/My Profile/OrderList";
import AddressSection from "@/Sections/UserProfile/AddressSection";
import WishListSection from "@/Sections/UserProfile/WishListSection";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import ProfilePageState from "@/components/genericComponents/ProfilePageState";
import useUserProfilePage from "@/hooks/useUserProfilePage";

export default function UserProfilePage() {
  const {
    data,
    isLoading,
    error,
    statsData,
    getStatusColor,
    getPaymentStatusColor,
    formatPrice,
  } = useUserProfilePage();

  if (isLoading) {
    return (
      <BaseSection>
        <ProfilePageState type="loading" loadingMessage="Loading profile" />
      </BaseSection>
    );
  }

  if (error) {
    return (
      <BaseSection>
        <ProfilePageState
          type="error"
          title="Error loading profile"
          message={error.message}
        />
      </BaseSection>
    );
  }

  if (!data) {
    return (
      <BaseSection>
        <ProfilePageState
          title="No profile found"
          message="We could not find profile data for this account."
        />
      </BaseSection>
    );
  }

  return (
    <>
      <BaseSection>
        <UserProfileCard user={data?.contacts} />
        <StatsGrid stats={statsData || []} />
        <OrderHistoryList
          orders={data?.Orders}
          getStatusColor={getStatusColor}
          getPaymentStatusColor={getPaymentStatusColor}
          formatPrice={formatPrice}
        />
        <AddressSection addresses={data?.Addresses} />
        <WishListSection WishList={data?.wishlist} />
      </BaseSection>
    </>
  );
}
