import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
export default function WishListPage() {
  return (
    <>
      <BaseSection>
        <UserNestedRoutesHeader
          className="w-full"
          iconName="wishlist"
          title="My WishList"
          info="0 items"
          button="Clear WishList"
        />
        
      </BaseSection>
    </>
  );
}
