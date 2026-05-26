import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCouponForCustomer,
  createDiscountForProduct,
  deleteCouponForCustomer,
  deleteDiscountForProduct,
  getCouponsAndDiscounts,
  updateCouponForCustomer,
  updateDiscountForProduct,
} from "@/APIs/adminCouponsDiscounts";
import useCurrency from "@/hooks/CurrencyChange";
import useURLQuery from "@/hooks/UrlQuery";
import { queryClient } from "@/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCurrencyStore } from "@/zustand_preferences/currency";

const defaultQuery = {
  CouponsPage: 1,
  ProductsPage: 1,
  limit: 5,
};

function getItemId(item) {
  return item?._id || item?.id || item;
}

export default function useAdminCouponsPage() {
  const { toast } = useToast();
  const { currency, conversion_rate, locale } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const { MainQuery, updateUrlQuery } = useURLQuery(defaultQuery);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["admin-coupons", MainQuery],
    queryFn: () => getCouponsAndDiscounts(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const couponOrDiscountMutation = useMutation({
    mutationFn: ({ action, item }) => {
      if (action === "createCoupon") return createCouponForCustomer(item);
      if (action === "createDiscount") return createDiscountForProduct(item);
      if (action === "updateCoupon") return updateCouponForCustomer(getItemId(item), item);
      if (action === "updateDiscount") return updateDiscountForProduct(getItemId(item), item);
      if (action === "deleteCoupon") return deleteCouponForCustomer(getItemId(item));
      if (action === "deleteDiscount") return deleteDiscountForProduct(getItemId(item));
      throw new Error("Unknown coupon or discount action");
    },
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const couponsData = data?.coupons || [];
  const discountedProducts = data?.discounts || [];
  const currentCouponsPage = data?.pagination?.coupons?.page || 1;
  const currentProductsPage = data?.pagination?.discounts?.page || 1;
  const totalPagesOfCoupons = data?.pagination?.coupons?.totalPages || 1;
  const totalPagesOfProducts = data?.pagination?.discounts?.totalPages || 1;
  const deleteTargetLabel =
    deleteMode === "coupon"
      ? selectedItem?.code
      : selectedItem?.title || selectedItem?.sku;

  const openEditDialog = (item, mode) => {
    setEditDialogOpen(true);
    setSelectedItem(item);
    setEditMode(mode);
  };

  const openDeleteDialog = (item, mode) => {
    setDeleteDialogOpen(true);
    setSelectedItem(item);
    setDeleteMode(mode);
  };

  const closeDeleteDialog = (open) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSelectedItem(null);
      setDeleteMode(null);
    }
  };

  const handleDelete = () => {
    if (!selectedItem || !deleteMode) return;

    couponOrDiscountMutation.mutate({
      action: deleteMode === "coupon" ? "deleteCoupon" : "deleteDiscount",
      item: selectedItem,
    });
    setDeleteDialogOpen(false);
    setSelectedItem(null);
    setDeleteMode(null);
  };

  const handleUpdate = (form) => {
    if (!selectedItem || !editMode) return;

    couponOrDiscountMutation.mutate({
      action: editMode === "coupon" ? "updateCoupon" : "updateDiscount",
      item: form,
    });
    setEditDialogOpen(false);
    setSelectedItem(null);
    setEditMode(null);
  };

  const handleCreate = (activeTab, item) => {
    couponOrDiscountMutation.mutate({
      action: activeTab === "coupon" ? "createCoupon" : "createDiscount",
      item,
    });
    setEditDialogOpen(false);
  };

  return {
    data,
    couponsData,
    discountedProducts,
    currentCouponsPage,
    currentProductsPage,
    totalPagesOfCoupons,
    totalPagesOfProducts,
    isLoading,
    isFetching,
    isError,
    error,
    format,
    rate,
    MainQuery,
    updateUrlQuery,
    editDialogOpen,
    editMode,
    selectedItem,
    deleteDialogOpen,
    deleteMode,
    deleteTargetLabel,
    setEditDialogOpen,
    openEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
