import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import AddressCard from "@/components/genericComponents/AddressCard";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import EditAddressForm from "@/Sections/UserProfile/EditAddressForm";
import { Fragment } from "react";
import ProfilePageState from "@/components/genericComponents/ProfilePageState";
import useUserAddressesPage from "@/hooks/useUserAddressesPage";

export default function UserAddressesPage() {
  let content = null;
  const {
    addressesObj,
    addresses,
    isLoadingAddresses,
    error,
    defaultAddressId,
    editingAddress,
    shouldShowEditForm,
    shouldShowAddForm,
    handleEdit,
    handleAdd,
    handleDelete,
    handleCancel,
    setAsDefault,
  } = useUserAddressesPage();

  if (isLoadingAddresses) {
    content = (
      <ProfilePageState type="loading" loadingMessage="Loading addresses" />
    );
  }
  if (error) {
    content = (
      <ProfilePageState
        type="error"
        title="Error loading addresses"
        message={error.message}
      />
    );
  }
  if (!addressesObj && !isLoadingAddresses && !error) {
    content = (
      <ProfilePageState
        title="No addresses found"
        message="Your saved addresses are not available right now."
      />
    );
  }
  if (addressesObj) {
    content = (
      <>
        {shouldShowEditForm && (
          <EditAddressForm
            title="Edit Address"
            buttonText="Save"
            buttonIconName="save"
            onCancel={handleCancel}
            InitialFormData={editingAddress}
          />
        )}
        {shouldShowAddForm && (
          <EditAddressForm
            title="Add Address"
            buttonText="Add"
            buttonIconName="plus"
            onCancel={handleCancel}
          />
        )}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-10">
            {addresses.map((address) => (
              <Fragment key={address._id}>
                <AddressCard
                  type={address.label}
                  isDefault={address._id === defaultAddressId}
                  name={address.name}
                  street={address.street}
                  city={address.city}
                  state={address.state}
                  zip={address.zipCode}
                  phone={address.phone}
                  email={address.email}
                  country={address.country}
                  onEdit={() => handleEdit(address._id)}
                  onSetDefault={() => {
                    setAsDefault(address._id);
                  }}
                  onRemove={() => {
                    handleDelete(address._id);
                  }}
                />
              </Fragment>
            ))}
          </div>
        ) : (
          <ProfilePageState
            title="No addresses found"
            message="Add an address to make checkout faster."
          />
        )}
      </>
    );
  }
  return (
    <BaseSection>
      <UserNestedRoutesHeader
        iconName="location"
        title="My Addresses"
        info={`${addressesObj?.addresses?.length || 0} addresses`}
        buttonIconName="plus"
        buttonText="Add Address"
        onClick={handleAdd}
      />
      {content}
    </BaseSection>
  );
}
