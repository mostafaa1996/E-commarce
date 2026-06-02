import { Edit, Trash2, Copy, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { CreateCouponDiscountDialog } from "@/components/admin/CreateCouponDiscountDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import Loading from "@/components/genericComponents/Loading";
import useAdminCouponsPage from "@/hooks/useAdminCouponsPage";

export default function AdminCouponsPage() {
  let content = null;
  const {
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
  } = useAdminCouponsPage();

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
      key: "disCountType",
      header: "Discount Type",
      render: (item) => (
        <span className="font-semibold text-primary">{item.discountType}</span>
      ),
    },
    {
      key: "value",
      header: "Value",
      render: (item) => (
        <span className="font-semibold text-primary">{item.discountValue}</span>
      ),
    },
    {
      key: "eligibilityType",
      header: "Eligibility Type",
      render: (item) => (
        <span className="font-semibold text-primary">{item.eligibilityType}</span>
      ),
    },
    {
      key: "eligibilityValue",
      header: "Eligibility Value",
      render: (item) => (
        <span className="font-semibold text-primary">{item.eligibilityValue}</span>
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
        <span className="font-semibold text-primary">{item.usageCount}/{item.usageLimit}</span>
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
            onClick={() => openEditDialog(item, "coupon")}
          >
            <Edit className="h-4 w-4" />
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => openDeleteDialog(item, "coupon")}
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
            onClick={() => openEditDialog(item, "discount")}
          >
            <Edit className="h-4 w-4" />
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => openDeleteDialog(item, "discount")}
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
          onOpenChange={closeDeleteDialog}
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
