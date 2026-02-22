import BaseSection from "../Sections/UserProfile/BaseSectionForUserProfile";
import AddressCard from "../../components/genericComponents/AddressCard";
import UserNestedRoutesHeader from "../Sections/UserProfile/UserNestedRoutesHeader";
import EditAddressForm from "../Sections/UserProfile/EditAddressForm";
import { useState } from "react";
export default function UserAddressesPage({}) {
    const [isEditing, setIsEditing] = useState(false);
    function handleEdit() {
        setIsEditing(true);
    }
  return (
    <BaseSection>
      <UserNestedRoutesHeader iconName="location" title="My Addresses" info="1 addresses" />
      {isEditing && <EditAddressForm title="Edit Address" />}
      <AddressCard
        type="Home"
        isDefault={true}
        name="John Doe"
        street="123 Main Street, Apt 4B"
        city="New York, NY 10001"
        country="United States"
        onEdit={handleEdit}
        onSetDefault={() => {}}
        onRemove={() => {}}
      />
    </BaseSection>
  );
}
