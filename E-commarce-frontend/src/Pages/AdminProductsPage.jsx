import Icon from "@/system/icons/Icon";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductDialog } from "@/components/admin/ProductDialog";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import InputField from "@/components/genericComponents/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/adminUI/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/adminUI/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/adminUI/alert-dialog";
import Loading from "@/components/genericComponents/Loading";
import { formatTime, shortenText } from "@/utils/utils";
import useAdminProductsPage from "@/hooks/useAdminProductsPage";

export default function AdminProductsPage() {
  let content = null;
  const {
    productsData,
    products,
    isLoading,
    isFetching,
    isError,
    error,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    searchInput,
    setSearchInput,
    updateUrlQuery,
    currentPage,
    resetFilters,
    isQueryChanged,
    openEdit,
    openView,
    closeProductFlow,
    viewProduct,
    editProduct,
    dialogProductData,
    pendingDialogMode,
    setPendingDialogMode,
    productToDelete,
    setProductToDelete,
    handleDelete,
    handleCreateProduct,
    handleUpdateProduct,
    targetedProductLoading,
    targetedProductFetching,
    targetedProductError,
    targetedProductErrorData,
    refetchTargetedProduct,
  } = useAdminProductsPage();

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            className="text-2xl h-10 w-10"
            src={item.image}
            alt={item.name}
          />
          <div>
            <p className="font-medium text-foreground">
              {shortenText(item.name, 25)}
            </p>
            <div>
              <p className="text-xs text-muted-foreground">{item.itemId}</p>
              <p className="text-xs text-muted-foreground">
                {item.brand && item.brand !== "None" ? `${item.brand}` : ""}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="font-semibold flex justify-start">
          {item.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item) => <span className="font-semibold">{item.price}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      render: (item) => (
        <StatusBadge
          status={
            item.stock === 0
              ? "danger"
              : item.stock < 10
                ? "warning"
                : "success"
          }
        >
          {item.stock === 0 ? "Out of stock" : `${item.stock} units`}
        </StatusBadge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={item.status === "Active" ? "success" : "pending"}>
          {item.status}
        </StatusBadge>
      ),
    },
    {
      key: "date",
      header: "Created",
      render: (item) => (
        <span className="font-semibold">{formatTime(item.date)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AdminButton variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="moreHorizontal" className="h-4 w-4" />
            </AdminButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openView(item)}>
              <Icon name="eye" className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEdit(item)}>
              <Icon name="edit" className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setProductToDelete(item)}
            >
              <Icon name="trash2" className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading && !productsData) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Products"
          description="Loading your latest store products."
          breadcrumbs={[{ label: "Products" }]}
        />
        <Loading message="Loading Products" fullPage />
      </AdminLayout>
    );
  }

  if (error || isError) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Products"
          description="We could not load your store Products right now."
          breadcrumbs={[{ label: "Products" }]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load dashboard data.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (productsData) {
    const { pagination } = productsData;
    content = (
      <AdminLayout>
        <PageHeader
          title="Products"
          description="Manage your product catalog"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Products" },
          ]}
          actions={
            <ProductDialog
              trigger={
                <AdminButton>
                  <Icon name="plus" className="h-4 w-4 mr-2 text-white" />
                  Add Product
                </AdminButton>
              }
              onSubmit={handleCreateProduct}
            />
          }
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <InputField
              placeholder="Search products..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {isQueryChanged && (
            <AdminButton
              onClick={resetFilters}
              variant="ghost"
              className="w-full sm:w-auto"
            >
              Clear Filters
            </AdminButton>
          )}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[160px] h-auto ">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tablets">Tablets</SelectItem>
              <SelectItem value="monitors">Monitors</SelectItem>
              <SelectItem value="Smartphones">Smart phones</SelectItem>
              <SelectItem value="Headphones">Headphones</SelectItem>
              <SelectItem value="Smart Home">Smart Home</SelectItem>
              <SelectItem value="Cameras">Cameras</SelectItem>
              <SelectItem value="Laptops">Laptops</SelectItem>
              <SelectItem value="Smart Watches">Smart Watches</SelectItem>
              <SelectItem value="Computer Accessories">
                Computer Accessories
              </SelectItem>
              <SelectItem value="Gaming Accessories">
                Gaming Accessories
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[140px] h-auto ">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <div
            className={`transition-opacity duration-200 ${
              isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <DataTable
              columns={columns}
              data={products}
              page={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => updateUrlQuery({ page })}
            />
          </div>

          {isFetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/35 backdrop-blur-[1px]">
              <div
                className="relative flex h-12 w-12 items-center justify-center"
                role="status"
                aria-live="polite"
                aria-label="Refreshing products"
              >
                <div className="absolute h-full w-full rounded-full border-4 border-orange-100" />
                <div className="absolute h-full w-full animate-spin rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-400" />
                <div className="h-6 w-6 rounded-full bg-orange-500/10 shadow-inner" />
              </div>
            </div>
          )}
        </div>

        <Dialog
          open={
            !!pendingDialogMode &&
            (targetedProductLoading || targetedProductFetching)
          }
          onOpenChange={(open) => !open && closeProductFlow()}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Loading product</DialogTitle>
              <DialogDescription>
                We are fetching the full product details before opening the
                product dialog.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-6">
              <div
                className="relative flex h-12 w-12 items-center justify-center"
                role="status"
                aria-live="polite"
                aria-label="Loading product details"
              >
                <div className="absolute h-full w-full rounded-full border-4 border-orange-100" />
                <div className="absolute h-full w-full animate-spin rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-400" />
                <div className="h-6 w-6 rounded-full bg-orange-500/10 shadow-inner" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!pendingDialogMode && targetedProductError}
          onOpenChange={(open) => !open && closeProductFlow()}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Failed to load product</DialogTitle>
              <DialogDescription>
                {targetedProductErrorData?.message ||
                  "Something went wrong while loading this product."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <AdminButton variant="ghost" onClick={closeProductFlow}>
                Close
              </AdminButton>
              <AdminButton onClick={() => refetchTargetedProduct()}>
                Try Again
              </AdminButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ProductDialog
          mode="view"
          open={!!viewProduct}
          onOpenChange={(open) => !open && closeProductFlow()}
          initialData={dialogProductData}
          onEditFromView={() => setPendingDialogMode("edit")}
        />

        <ProductDialog
          mode="edit"
          open={!!editProduct}
          onOpenChange={(open) => !open && closeProductFlow()}
          initialData={dialogProductData}
          onSubmit={handleUpdateProduct}
        />

        <AlertDialog
          open={!!productToDelete}
          onOpenChange={(open) => !open && setProductToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete "{productToDelete?.name}"?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this product from your catalog.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
