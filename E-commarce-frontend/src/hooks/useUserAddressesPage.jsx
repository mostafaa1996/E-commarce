import { getUserAddresses } from "@/APIs/UserProfileService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function useUserAddressesPage(callBackFNAtChangeDefaultAddress) {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const actionData = useActionData();
  const location = useLocation();
  const navigate = useNavigate();

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
    currentState === "add" || location.state?.openAddAddress;

  useEffect(() => {
    if (!actionData?.ok) return;

    const timeout = setTimeout(() => {
      setCurrentState("");
      if (location.state?.openAddAddress) {
        navigate(`${location.pathname}${location.search}`, {
          replace: true,
          state: null,
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [actionData, location.pathname, location.search, location.state, navigate]);

  function handleEdit(addressId) {
    setCurrentState(`edit-${addressId}`);
  }

  function handleAdd() {
    setCurrentState("add");
  }

  function handleGoToAddAddress() {
    navigate("/profile/addresses", {
      state: { openAddAddress: true },
    });
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
    if (location.state?.openAddAddress) {
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: null,
      });
    }
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
