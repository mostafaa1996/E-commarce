import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import AddressCard from "@/components/genericComponents/AddressCard";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import EditAddressForm from "@/Sections/UserProfile/EditAddressForm";
import { Fragment, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAddresses } from "@/APIs/UserProfileService";
import { useFetcher, useActionData, useLoaderData } from "react-router-dom";
import useProfileRoutingStates from "@/zustand_ProfileRoutesStates/ProfileRoutesStates";
import ProfilePageState from "@/components/genericComponents/ProfilePageState";
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
  const {currentRouteState , setCurrentRouteState} = useProfileRoutingStates();

  function handleEdit(addressId) {
    setCurrentState(`edit-${addressId}`);
  }

  function handleAdd() {
    console.log("add");
    setCurrentState("add");
  }

  function handleDelete(addressId) {
    setCurrentState(`delete-${addressId}`);
    fetcher.submit(
      { intent: "delete", id: addressId },
      { method: "post", action: `/profile/addresses` },
    );
  }

  function handleCancel() {
    setCurrentState("");
    setCurrentRouteState({
      ...currentRouteState,
      previousAction: "Cancel",
    });
  }

  function setAsDefault(addressId) {
    setDefaultAddress(addressId);
    fetcher.submit(
      { intent: "setAsDefault", id: addressId },
      { method: "post", action: `/profile/addresses` },
    );
  }

  useEffect(() => {
    if (!actionData?.ok) return;

    const timeout = setTimeout(() => {
      setCurrentState("");
    }, 0);

    return () => clearTimeout(timeout);
  }, [actionData]);

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
    // console.log(addressesObj?.addresses, addressesObj?.addresses?.length);
    content = (
      <>
        {currentState.includes("edit") && (
          <EditAddressForm
            title="Edit Address"
            buttonText="Save"
            buttonIconName="save"
            onCancel={handleCancel}
            InitialFormData={addressesObj?.addresses?.find(
              (address) => address._id === currentState.split("-")[1],
            )}
          />
        )}
        {(currentState === "add" || (currentRouteState.previousAction === "Add address"))  && (
          <EditAddressForm
            title="Add Address"
            buttonText="Add"
            buttonIconName="plus"
            onCancel={handleCancel}
          />
        )}
        {addressesObj?.addresses?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-10">
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
