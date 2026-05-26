import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAdminCustomer,
  getAdminCustomers,
  updateAdminCustomerStatus,
} from "@/APIs/adminCustomersService";
import useURLQuery from "@/hooks/UrlQuery";
import { queryClient } from "@/queryClient";
import { useToast } from "@/hooks/use-toast";

const defaultQuery = {
  status: "all",
  search: "",
  spent: "all",
  page: 1,
  limit: 10,
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.spent !== defaultQuery.spent ||
    query.search !== defaultQuery.search
  );
}

function getCustomerStatusVariant(status) {
  return status === "active"
    ? "success"
    : status === "inactive"
      ? "pending"
      : "danger";
}

function updateCustomerInList(oldData, customerId, customerPatch) {
  if (!oldData?.customers) return oldData;

  return {
    ...oldData,
    customers: oldData.customers.map((customer) =>
      customer.id === customerId || customer._id === customerId
        ? { ...customer, ...customerPatch }
        : customer,
    ),
  };
}

function updateSelectedCustomer(oldData, customerPatch) {
  if (!oldData?.customer) return oldData;

  return {
    ...oldData,
    customer: {
      ...oldData.customer,
      ...customerPatch,
    },
  };
}

export default function useAdminCustomersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [spentarrangement, setSpentarrangement] = useState("all");
  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);

  const {
    data: customersData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["AdminCustomers", MainQuery],
    queryFn: () => getAdminCustomers(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    isFetching: isFetchingCustomer,
    error: errorCustomer,
  } = useQuery({
    queryKey: ["AdminCustomer", selectedCustomerId],
    queryFn: () => getAdminCustomer(selectedCustomerId),
    enabled: !!selectedCustomerId,
  });

  const { mutate: mutateCustomerStatus, isPending: isUpdatingCustomerStatus } =
    useMutation({
      mutationFn: ({ customerId, status }) =>
        updateAdminCustomerStatus(customerId, status),
      onMutate: async ({ customerId, status }) => {
        await queryClient.cancelQueries({ queryKey: ["AdminCustomers"] });
        await queryClient.cancelQueries({
          queryKey: ["AdminCustomer", customerId],
        });

        const previousCustomersData = queryClient.getQueryData([
          "AdminCustomers",
          MainQuery,
        ]);
        const previousCustomerData = queryClient.getQueryData([
          "AdminCustomer",
          customerId,
        ]);

        queryClient.setQueryData(["AdminCustomers", MainQuery], (oldData) =>
          updateCustomerInList(oldData, customerId, { status }),
        );
        queryClient.setQueryData(["AdminCustomer", customerId], (oldData) =>
          updateSelectedCustomer(oldData, { status }),
        );

        return { previousCustomersData, previousCustomerData, customerId };
      },
      onError: (error, { customerId }, context) => {
        if (context?.previousCustomersData) {
          queryClient.setQueryData(
            ["AdminCustomers", MainQuery],
            context.previousCustomersData,
          );
        }
        if (context?.previousCustomerData) {
          queryClient.setQueryData(
            ["AdminCustomer", customerId],
            context.previousCustomerData,
          );
        }
        toast({
          title: "Failed to update customer",
          description: error.message,
          variant: "destructive",
        });
      },
      onSuccess: (data, { customerId, status }) => {
        const updatedCustomer = data?.customer ?? data;
        const customerPatch = {
          ...updatedCustomer,
          status: updatedCustomer?.status ?? status,
        };

        queryClient.setQueryData(["AdminCustomers", MainQuery], (oldData) =>
          updateCustomerInList(oldData, customerId, customerPatch),
        );
        queryClient.setQueryData(["AdminCustomer", customerId], (oldData) =>
          updateSelectedCustomer(oldData, customerPatch),
        );

        toast({
          title:
            customerPatch.status === "blocked"
              ? "Customer blocked"
              : "Customer unblocked",
          description: "Customer status has been updated.",
        });
      },
      onSettled: (_data, _error, { customerId }) => {
        queryClient.invalidateQueries({ queryKey: ["AdminCustomers"] });
        queryClient.invalidateQueries({
          queryKey: ["AdminCustomer", customerId],
        });
      },
    });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchInput]);

  useEffect(() => {
    updateUrlQuery({
      search: searchTerm,
      status: selectedStatus,
      spent: spentarrangement,
      limit: 10,
    });
  }, [selectedStatus, searchTerm, spentarrangement, updateUrlQuery]);

  const resetFilters = () => {
    resetUrlQuery(defaultQuery);
    setSearchInput("");
    setSearchTerm("");
    setSelectedStatus("all");
    setSpentarrangement("all");
  };

  return {
    customersData,
    customers: customersData?.customers || [],
    customerData,
    isLoading,
    isFetching,
    error,
    isLoadingCustomer,
    isFetchingCustomer,
    errorCustomer,
    isCustomerDetailsLoading: isLoadingCustomer || isFetchingCustomer,
    isUpdatingCustomerStatus,
    MainQuery,
    updateUrlQuery,
    searchInput,
    setSearchInput,
    selectedStatus,
    setSelectedStatus,
    selectedCustomerId,
    setSelectedCustomerId,
    spentarrangement,
    setSpentarrangement,
    mutateCustomerStatus,
    resetFilters,
    isQueryChanged: isQueryChangedFromDefault(MainQuery),
    getCustomerStatusVariant,
  };
}
