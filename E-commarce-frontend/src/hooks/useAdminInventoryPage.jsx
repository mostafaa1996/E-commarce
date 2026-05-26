import {
  getAdminInventory,
  updateAdminInventory,
} from "@/APIs/adminInventoryService";
import useURLQuery from "@/hooks/UrlQuery";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const defaultQuery = {
  page: 1,
  limit: 10,
};

export default function useAdminInventoryPage() {
  const { toast } = useToast();
  const { MainQuery, updateUrlQuery } = useURLQuery(defaultQuery);
  const [stock, setStock] = useState({});
  const [lowStockThreshold, setLowStockThreshold] = useState({});
  const [criticalStockThreshold, setCriticalStockThreshold] = useState({});
  const [updatingKey, setUpdatingKey] = useState(null);

  const inventoryQuery = useQuery({
    queryKey: ["adminInventory", MainQuery],
    queryFn: () => getAdminInventory(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const { mutateAsync: updateInventory } = useMutation({
    mutationFn: ({ id, variantId, intent }) =>
      updateAdminInventory({ id, variantId, intent }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });
      setUpdatingKey(null);
    },
  });

  function updateStockDraft(sku, value) {
    setStock((current) => ({ ...current, [sku]: value }));
  }

  function updateLowStockThresholdDraft(sku, value) {
    setLowStockThreshold((current) => ({ ...current, [sku]: value }));
  }

  function updateCriticalStockThresholdDraft(sku, value) {
    setCriticalStockThreshold((current) => ({ ...current, [sku]: value }));
  }

  return {
    inventoryData: inventoryQuery.data,
    isLoading: inventoryQuery.isLoading,
    isFetching: inventoryQuery.isFetching,
    isError: inventoryQuery.isError,
    error: inventoryQuery.error,
    stock,
    lowStockThreshold,
    criticalStockThreshold,
    updatingKey,
    setUpdatingKey,
    updateInventory,
    updateStockDraft,
    updateLowStockThresholdDraft,
    updateCriticalStockThresholdDraft,
    updateUrlQuery,
  };
}
