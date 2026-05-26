import { getAdminOrders, updateAdminOrder } from "@/APIs/adminOrdersService";
import useURLQuery from "@/hooks/UrlQuery";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const defaultQuery = {
  status: "all",
  paymentStatus: "all",
  search: "",
  page: 1,
  limit: 10,
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.paymentStatus !== defaultQuery.paymentStatus ||
    query.search !== defaultQuery.search
  );
}

export default function useAdminOrdersPage() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);

  const ordersQuery = useQuery({
    queryKey: ["AdminOrders", MainQuery],
    queryFn: () => getAdminOrders(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: (order) => updateAdminOrder(order.id, order),
    onSuccess: () => {
      setSelectedOrder(null);
      toast({ title: "Order updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["AdminOrders"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    updateUrlQuery({
      search: searchTerm,
      status: selectedStatus,
      paymentStatus: selectedPaymentStatus,
      limit: 10,
    });
  }, [selectedPaymentStatus, selectedStatus, searchTerm, updateUrlQuery]);

  function resetFilters() {
    resetUrlQuery(defaultQuery);
    setSearchInput("");
    setSearchTerm("");
    setSelectedPaymentStatus("all");
    setSelectedStatus("all");
  }

  return {
    ordersData: ordersQuery.data,
    orders: ordersQuery.data?.orders || [],
    isLoading: ordersQuery.isLoading,
    isFetching: ordersQuery.isFetching,
    error: ordersQuery.error,
    selectedOrder,
    setSelectedOrder,
    searchInput,
    setSearchInput,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    selectedStatus,
    setSelectedStatus,
    updateOrderStatus,
    updateUrlQuery,
    resetFilters,
    isQueryChanged: isQueryChangedFromDefault(MainQuery),
  };
}
