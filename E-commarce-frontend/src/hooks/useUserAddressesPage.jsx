import { getUserAddresses } from "@/APIs/UserProfileService";
import useProfileRoutingStates from "@/zustand_ProfileRoutesStates/ProfileRoutesStates";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

export default function useUserAddressesPage(callBackFNAtChangeDefaultAddress) {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const actionData = useActionData();
  const navigate = useNavigate();
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

  const addressErrorForm = useMemo(() => {
    if (!Array.isArray(actionData)) return {};
    return {
      name:
        actionData
          ?.filter((error) => error.path === "name")
          .map((error) => error.msg) || [],
      phone:
        actionData
          ?.filter((error) => error.path === "phone")
          .map((error) => error.msg) || [],
      street:
        actionData
          ?.filter((error) => error.path === "street")
          .map((error) => error.msg) || [],
      city:
        actionData
          ?.filter((error) => error.path === "city" || error.path === "state")
          .map((error) => error.msg) || [],
      country:
        actionData
          ?.filter((error) => error.path === "country")
          .map((error) => error.msg) || [],
      zipCode:
        actionData
          ?.filter((error) => error.path === "zipCode")
          .map((error) => error.msg) || [],
      email:
        actionData
          ?.filter((error) => error.path === "email")
          .map((error) => error.msg) || [],
      label:
        actionData
          ?.filter((error) => error.path === "label")
          .map((error) => error.msg) || [],
    };
  }, [actionData]);

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

  function handleGoToAddAddress() {
    setCurrentRouteState({
      currentRoute: "addresses",
      previousAction: "Add address",
    });
    navigate("/profile/addresses");
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

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data?.ok &&
      fetcher.data?.message === "Address set as default successfully"
    ) {
      callBackFNAtChangeDefaultAddress?.();
    }
  }, [fetcher.state, fetcher.data, callBackFNAtChangeDefaultAddress]);

  return {
    addressesObj: addressesQuery.data,
    addresses,
    isLoadingAddresses: addressesQuery.isLoading,
    error: addressesQuery.error,
    defaultAddressId,
    editingAddress,
    shouldShowEditForm,
    shouldShowAddForm,
    addressErrorForm,
    handleEdit,
    handleAdd,
    handleGoToAddAddress,
    handleDelete,
    handleCancel,
    setAsDefault,
  };
}
