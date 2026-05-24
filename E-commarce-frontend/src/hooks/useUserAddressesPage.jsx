import { getUserAddresses } from "@/APIs/UserProfileService";
import useProfileRoutingStates from "@/zustand_ProfileRoutesStates/ProfileRoutesStates";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useActionData, useFetcher, useLoaderData } from "react-router-dom";

export default function useUserAddressesPage() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const actionData = useActionData();
  const { currentRouteState, setCurrentRouteState } = useProfileRoutingStates();

  const loaderAddresses = loaderData?.addresses || [];
  const loaderDefaultAddressId = loaderAddresses.find(
    (address) => address.isDefault,
  )?._id;

  const [currentState, setCurrentState] = useState("");
  const [defaultAddressOverride, setDefaultAddressOverride] = useState(
    loaderDefaultAddressId,
  );

  const addressesQuery = useQuery({
    queryKey: ["profile-addresses"],
    queryFn: getUserAddresses,
  });

  const addresses = useMemo(
    () => addressesQuery.data?.addresses || [],
    [addressesQuery.data],
  );

  const defaultAddressId =
    defaultAddressOverride ||
    addresses.find((address) => address.isDefault)?._id ||
    loaderDefaultAddressId;

  const editingAddressId = currentState.includes("edit")
    ? currentState.split("-")[1]
    : null;

  const editingAddress = editingAddressId
    ? addresses.find((address) => address._id === editingAddressId)
    : null;

  const shouldShowEditForm = Boolean(editingAddressId);
  const shouldShowAddForm =
    currentState === "add" ||
    currentRouteState.previousAction === "Add address";

  useEffect(() => {
    if (!actionData?.ok) return;

    const timeout = setTimeout(() => {
      setCurrentState("");
    }, 0);

    return () => clearTimeout(timeout);
  }, [actionData]);

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
      { method: "post", action: "/profile/addresses" },
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
    setDefaultAddressOverride(addressId);
    fetcher.submit(
      { intent: "setAsDefault", id: addressId },
      { method: "post", action: "/profile/addresses" },
    );
  }

  return {
    addressesObj: addressesQuery.data,
    addresses,
    isLoadingAddresses: addressesQuery.isLoading,
    error: addressesQuery.error,
    defaultAddressId,
    editingAddress,
    shouldShowEditForm,
    shouldShowAddForm,
    handleEdit,
    handleAdd,
    handleDelete,
    handleCancel,
    setAsDefault,
  };
}
