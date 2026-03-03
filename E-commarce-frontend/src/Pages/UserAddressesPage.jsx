import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import AddressCard from "@/components/genericComponents/AddressCard";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import EditAddressForm from "@/Sections/UserProfile/EditAddressForm";
import { Fragment, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAddresses } from "@/APIs/UserProfileService";
import { useFetcher, useActionData, useLoaderData } from "react-router-dom";
export default function UserAddressesPage() {
  let content = null;
  const { addresses } = useLoaderData();
  const fetcher = useFetcher();
  const actionData = useActionData();
  const DefaultAddressId = addresses?.find((address) => address.isDefault)?._id;
  const [currentState, setCurrentState] = useState("");
  const [DefaultAddress, setDefaultAddress] = useState(DefaultAddressId);
  const {
    data: addressesObj,
    isLoading: isLoadingAddresses,
    error,
  } = useQuery({
    queryKey: ["profile-addresses"],
    queryFn: getUserAddresses,
  });

  function handleEdit(addressId) {
    setCurrentState(`edit-${addressId}`);
  }

  function handleAdd() {
    setCurrentState("add");
  }

  function handleDelete(addressId) {
    setCurrentState(`delete-${addressId}`);
    fetcher.submit(
      { intent: "delete", id: addressId },
      { method: "post", action: `/profile/addresses` },
    );
  }

  function setAsDefault(addressId) {
    setDefaultAddress(addressId);
    fetcher.submit(
      { intent: "setAsDefault", id: addressId },
      { method: "post", action: `/profile/addresses` },
    );
  }

  useEffect(() => {
    if (actionData?.ok) setCurrentState("");
  }, [actionData]);

  if (isLoadingAddresses) {
    content = <p className="text-center text-2xl font-bold">Loading...</p>;
  }
  if (error) {
    content = (
      <p className="text-center text-2xl font-bold">Error loading profile</p>
    );
  }
  if (!addressesObj || addressesObj?.addresses?.length === 0) {
    content = (
      <h1 className="text-center text-2xl font-bold">No addresses found</h1>
    );
  }
  if (addressesObj) {
    // console.log(addressesObj?.addresses, addressesObj?.addresses?.length);
    content = (
      <>
        {currentState.includes("edit") && (
          <EditAddressForm
            title="Edit Address"
            buttonText="Save"
            buttonIconName="save"
            onCancel={() => setCurrentState("")}
            InitialFormData={addressesObj?.addresses?.find(
              (address) => address._id === currentState.split("-")[1],
            )}
          />
        )}
        {currentState === "add" && (
          <EditAddressForm
            title="Add Address"
            buttonText="Add"
            buttonIconName="plus"
            onCancel={() => setCurrentState("")}
          />
        )}
        {addressesObj?.addresses?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {addressesObj?.addresses.map((address) => (
              <Fragment key={address._id}>
                <AddressCard
                  type={address.label}
                  isDefault={address._id === DefaultAddress}
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
        )}
      </>
    );
  }
  return (
    <BaseSection>
      <UserNestedRoutesHeader
        iconName="location"
        title="My Addresses"
        info={`${addressesObj?.addresses?.length} addresses`}
        buttonIconName="plus"
        buttonText="Add Address"
        onClick={handleAdd}
      />
      {content}
    </BaseSection>
  );
}
