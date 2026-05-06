import { Edit, Trash2, Copy, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { CreateCouponDiscountDialog } from "@/components/admin/CreateCouponDiscountDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import Loading from "@/components/genericComponents/Loading";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCouponsAndDiscounts,
  createDiscountForProduct,
  deleteDiscountForProduct,
  updateDiscountForProduct,
  updateCouponForCustomer,
  deleteCouponForCustomer,
  createCouponForCustomer,
} from "@/APIs/adminCouponsDiscounts";
import { useState } from "react";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import  useCurrency  from "@/hooks/CurrencyChange";
import  useURLQuery  from "@/hooks/UrlQuery";

const defaultQuery = {
  CouponsPage: 1,
  ProductsPage: 1,
  limit: 5,
};

export default function AdminCouponsPage() {
  let content = null;
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

  const { mutate: MutateCouponOrDiscount } = useMutation({
    mutationFn: ({ action, item }) => {
      if (action === "createCoupon") {
        return createCouponForCustomer(item);
      } else if (action === "createDiscount") {
        return createDiscountForProduct(item);
      } else if (action === "updateCoupon") {
        return updateCouponForCustomer(item._id, item);
      } else if (action === "updateDiscount") {
        return updateDiscountForProduct(item._id, item);
      } else if (action === "deleteCoupon") {
        return deleteCouponForCustomer(item._id);
      } else if (action === "deleteDiscount") {
        return deleteDiscountForProduct(item._id);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
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
  const discountedProducts = data?.discounts|| [];
  const currentCouponsPage = data?.pagination?.coupons?.page || 1;
  const currentProductsPage = data?.pagination?.discounts?.page || 1;
  const totalPagesOfCoupons = data?.pagination?.coupons?.totalPages || 1;
  const totalPagesOfProducts = data?.pagination?.discounts?.totalPages || 1;
  const deleteTargetLabel =
    deleteMode === "coupon"
      ? selectedItem?.code
      : selectedItem?.title || selectedItem?.sku;

  const handleDelete = () => {
    if (!selectedItem || !deleteMode) return;

    const deleteId = selectedItem?._id || selectedItem?.id;
    MutateCouponOrDiscount({
      action: deleteMode === "coupon" ? "deleteCoupon" : "deleteDiscount",
      item: deleteId,
    });
    setDeleteDialogOpen(false);
    setSelectedItem(null);
    setDeleteMode(null);
  };

  const handleUpdate = (Form) => {
    if (!selectedItem || !editMode) return;
    console.log("Form" , Form);
    MutateCouponOrDiscount({
      action: editMode === "coupon" ? "updateCoupon" : "updateDiscount",
      item: Form,
    });
    setEditDialogOpen(false);
    setSelectedItem(null);
    setEditMode(null);
  };

  const handleCreate = (activeTab, item) => {
    MutateCouponOrDiscount({
      action: activeTab === "coupon" ? "createCoupon" : "createDiscount",
      item: item,
    });
    setEditDialogOpen(false);
  };

  if ((isLoading || isFetching) && !data) {
    content = <Loading message="Loading Coupons And Discounts" fullPage />;
  }

  if (error && isError && !data) {
    content = (
      <AdminLayout>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const CouponsColumns = [
    {
      key: "code",
      header: "Coupon Code",
      render: (item) => (
        <div className="flex items-center gap-2">
          <code className="bg-secondary px-2 py-1 rounded text-sm font-mono font-semibold text-foreground">
            {item.code}
          </code>
          <AdminButton
            onClick={() => navigator.clipboard.writeText(item.code)}
            variant="ghost"
            size="icon"
            className="h-6 w-6"
          >
            <Copy className="h-3 w-3" />
          </AdminButton>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className="font-semibold text-primary">{item.type}</span>
      ),
    },
    {
      key: "value",
      header: "Value",
      render: (item) => (
        <span className="font-semibold text-primary">{item.value}</span>
      ),
    },
    {
      key: "minOrder",
      header: "Min Order",
      render: (item) => (
        <span className="font-semibold text-primary">{item.minOrder}</span>
      ),
    },
    {
      key: "expiry",
      header: "Expires",
      render: (item) => (
        <span className="font-semibold text-primary">{item.expireDate}</span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      render: (item) => (
        <span className="font-semibold text-primary">{item.usages}/{item.usageLimit}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={item.status === "ACTIVE" ? "success" : "pending"}>
          {item.status}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item) => (
        <div className="flex gap-1">
          <AdminButton
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setEditDialogOpen(true);
              setSelectedItem(item);
              setEditMode("coupon");
            }}
          >
            <Edit className="h-4 w-4" />
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => {
              setDeleteDialogOpen(true);
              setSelectedItem(item);
              setDeleteMode("coupon");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </AdminButton>
        </div>
      ),
    },
  ];

  const productColumns = [
    {
      key: "title",
      header: "Product Title",
      render: (item) => (
        <span className="font-medium text-foreground">{item.title}</span>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      render: (item) => (
        <code className="bg-secondary px-2 py-1 rounded text-sm font-mono font-semibold text-foreground">
          {item.sku}
        </code>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item) => (
        <span className="font-semibold text-primary">
          {format(item.price * rate)}
        </span>
      ),
    },
    {
      key: "compareAtPrice",
      header: "Compare At Price",
      render: (item) => (
        <span className="text-muted-foreground line-through">
          {format(item.compareAtPrice * rate)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={item.status === "ACTIVE" ? "success" : "pending"}>
          {item.status}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item) => (
        <div className="flex gap-1">
          <AdminButton
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setEditDialogOpen(true);
              setSelectedItem(item);
              setEditMode("discount");
            }}
          >
            <Edit className="h-4 w-4" />
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => {
              setDeleteDialogOpen(true);
              setSelectedItem(item);
              setDeleteMode("discount");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </AdminButton>
        </div>
      ),
    },
  ];

  if (data) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Coupons & Discounts"
          description="Create and manage promotional coupons"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Coupons" },
          ]}
          actions={
            <CreateCouponDiscountDialog
              handleCreate={(activeTab, item) => handleCreate(activeTab, item)}
            />
          }
        />
        <DataTable
          columns={CouponsColumns}
          data={couponsData}
          page={currentCouponsPage}
          totalPages={totalPagesOfCoupons}
          onPageChange={(page) => {
            updateUrlQuery({
              ...MainQuery,
              CouponsPage: page,
              ProductsPage: currentProductsPage,
            });
          }}
        />
        <div className="mt-6">
          <DataTable
            columns={productColumns}
            data={discountedProducts}
            page={currentProductsPage}
            totalPages={totalPagesOfProducts}
            onPageChange={(page) => {
              updateUrlQuery({
                ...MainQuery,
                CouponsPage: currentCouponsPage,
                ProductsPage: page,
              });
            }}
          />
        </div>
        <CreateCouponDiscountDialog
          handleUpdate={handleUpdate}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          initialMode={editMode}
          initialData={selectedItem}
          hideTrigger
        />
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) {
              setSelectedItem(null);
              setDeleteMode(null);
            }
          }}
          title={`Delete "${deleteTargetLabel || "item"}"?`}
          description={
            deleteMode === "coupon"
              ? "This will permanently remove this coupon. This action cannot be undone."
              : "This will permanently remove this discount. This action cannot be undone."
          }
          onConfirm={handleDelete}
        />
      </AdminLayout>
    );
  } else if (!content) {
    content = <></>;
  }

  return <>{content}</>;
}
