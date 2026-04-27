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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import useURLQuery from "@/hooks/UrlQuery";
import {
  getAdminProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/APIs/adminProducts";
import Loading from "@/components/genericComponents/Loading";
import { formatTime, shortenText } from "@/utils/utils";

const defaultQuery = {
  status: "all",
  category: "all",
  search: "",
  page: 1,
  limit: 8,
};

const categoryValueMap = {
  Tablets: "Tablets",
  Monitors: "Monitors",
  "Gaming Accessories": "Gaming Accessories",
  Smartphones: "Smartphones",
  Headphones: "Headphones",
  "Smart Home": "Smart Home",
  Cameras: "Cameras",
  Laptops: "Laptops",
  "Smart Watches": "Smart Watches",
  "Computer Accessories": "Computer Accessories",
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.category !== defaultQuery.category ||
    query.search !== defaultQuery.search
  );
}

const toDialogProductData = (product) => ({
  id: product?._id || "",
  title: product?.title || product?.name || "",
  slug: (product?.slug || product?.title || product?.name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-"),
  slugAuto: !product?.slug,
  description: product?.description || "",
  shortDescription: product?.shortDescription || product?.description || "",
  brand: product?.brand && product.brand !== "None" ? product.brand : "",
  category: product?.sourceCategoryName || "",
  sourceCategoryName: product?.sourceCategoryName || "",
  isActive: product?.isActive ?? product?.status === "Active",
  status: product?.status || "New",
  price: String(product?.price || "").replace(/[^0-9.]/g, ""),
  originalPrice: String( product?.hasVariants ? 
    product?.variants?.find((v) => v._id === product?.defaultVariantId)
      ?.compareAtPrice || "" : product?.variants[0]?.compareAtPrice || "",
  ).replace(/[^0-9.]/g, ""),
  currency: product?.currency || "USD",
  mainImage: {
    url:
      product?.mainImage?.url ||
      (typeof product?.image === "string" && product.image.startsWith("http")
        ? product.image
        : ""),
    alt: product?.mainImage?.alt || product?.title || product?.name || "",
  },
  images: product?.images || [],
  specifications: product?.specifications || undefined,
  seo: product?.seo || undefined,
  hasVariants: Boolean(product?.hasVariants),
  variants: product?.variants || [],
  defaultVariantId: product?.defaultVariantId || "",
  stock:product?.hasVariants ? String(product?.inventory?.totalStock || 0) : String(product?.variants[0]?.stock || 0),
  sku: product?.hasVariants ? product?.variants?.find((v) => v._id === product?.defaultVariantId)
      .sku || "" : product?.variants[0]?.sku || "",
  shipping: product?.shipping || undefined,
  returnPolicy: product?.returnPolicy || undefined,
  tags: product?.tags || [],
  reviewSummary: product?.reviewSummary || undefined,
});

const fromDialogCategory = (value, fallback) =>
  Object.entries(categoryValueMap).find(
    ([, dialogValue]) => dialogValue === value,
  )?.[0] ||
  fallback ||
  "";

export default function AdminProductsPage() {
  let content = null;
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [pendingDialogMode, setPendingDialogMode] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);
  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminProducts", MainQuery],
    queryFn: () => getAdminProducts(MainQuery),
    placeholderData: (previousData) => previousData,
    keepPreviousData: true,
  });

  const {
    data: targetedProduct,
    isLoading: targetedProductLoading,
    isFetching: targetedProductFetching,
    isError: targetedProductError,
    error: targetedProductErrorData,
    refetch: refetchTargetedProduct,
  } = useQuery({
    queryKey: ["adminProduct", selectedProductId],
    queryFn: () => getProduct(selectedProductId),
    enabled: !!selectedProductId,
  });

  const createProductMutation = useMutation({
    mutationFn: (product) => createProduct(product),
    onMutate: (product) => {
      const tempId = `temp-${Date.now()}`;
      toast({
        title: "Creating Product",
        description: "We are creating your product.",
      });
      setProducts((prev) => [
        {
          id: tempId,
          name: product.title || "Untitled Product",
          itemId: "Pending",
          brand: product.brand || "None",
          category: fromDialogCategory(
            product.category,
            product.sourceCategoryName || "",
          ),
          price: product.price ? `$${product.price}` : "$0",
          stock: Number(product.stock ?? 0),
          status: product.isActive ? "Active" : "Draft",
          image: product.mainImage?.url || "",
          date: new Date().toISOString(),
        },
        ...prev,
      ]);
      return { tempId };
    },
    onError: (error, _product, context) => {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
      setProducts((prev) =>
        prev.filter((product) => product.id !== context?.tempId),
      );
    },
    onSuccess: (_data, product) => {
      toast({
        title: "Product created",
        description: `"${product.title}" has been created.`,
      });
      setSelectedProductId(null);
      setViewProduct(null);
    },
  });

  const UpdateProductMutation = useMutation({
    mutationFn: (product) => updateProduct(product.id, product),
    onMutate: (product) => {
      toast({
        title: "Creating Product",
        description: "We are creating your product.",
      });
      const originalProduct = products.find((p) => p.id === product.id);
      setProducts((prev) =>
        prev.map((currentProduct) =>
          currentProduct.id === product.id
            ? {
                ...currentProduct,
                name: product.title || currentProduct.name,
                brand: product.brand || currentProduct.brand,
                category: fromDialogCategory(
                  product.category,
                  product.sourceCategoryName || currentProduct.category,
                ),
                price: product.price
                  ? `$${product.price}`
                  : currentProduct.price,
                stock: Number(product.stock ?? currentProduct.stock),
                status: product.isActive ? "Active" : "Draft",
                image:
                  product.mainImage?.url ||
                  product.image ||
                  currentProduct.image,
                date: new Date().toISOString(),
              }
            : currentProduct,
        ),
      );
      return originalProduct;
    },
    onError: (error, _product, context) => {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
      setProducts((prev) =>
        prev.map((currentProduct) =>
          currentProduct.id === context?.id ? context : currentProduct,
        ),
      );
    },
    onSuccess: (_data, product) => {
      toast({
        title: "Product updated",
        description: `"${product.name}" has been saved.`,
      });
      setSelectedProductId(null);
      setEditProduct(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (product) => deleteProduct(product.id),
    onMutate: (product) => {
      toast({
        title: "Deleting Product",
        description: "We are deleting your product.",
      });
      const removedProduct = products.find(
        (currentProduct) => currentProduct.id === product.id,
      );
      setProducts((prev) =>
        prev.filter((currentProduct) => currentProduct.id !== product.id),
      );
      return { removedProduct };
    },
    onError: (error, _product, context) => {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
      if (context?.removedProduct) {
        setProducts((prev) => [context.removedProduct, ...prev]);
      }
    },
    onSuccess: (_data, product) => {
      toast({
        title: "Product deleted",
        description: `"${product.name}" has been removed.`,
        variant: "destructive",
      });
    },
  });

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

  const closeProductFlow = () => {
    setViewProduct(null);
    setEditProduct(null);
    setPendingDialogMode(null);
    setSelectedProductId(null);
  };

  const openEdit = (p) => {
    setSelectedProductId(p.id);
    setPendingDialogMode("edit");
  };

  const openView = (p) => {
    setSelectedProductId(p.id);
    setPendingDialogMode("view");
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete);
    setProductToDelete(null);
  };

  const onPageChange = (page) => {
    updateUrlQuery({ page });
    setCurrentPage(page);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [searchInput]);

  useEffect(() => {
    console.log(selectedCategory, selectedStatus, searchTerm);
    updateUrlQuery({
      category: selectedCategory,
      status: selectedStatus,
      search: searchTerm,
    });
  }, [selectedCategory, selectedStatus, searchTerm]);

  useEffect(() => {
    if (productsData?.products) {
      setProducts(productsData.products);
    }
  }, [productsData]);

  useEffect(() => {
    if (!targetedProduct || !pendingDialogMode) return;

    if (pendingDialogMode === "view") {
      setViewProduct(targetedProduct);
    }

    if (pendingDialogMode === "edit") {
      setEditProduct(targetedProduct);
    }

    setPendingDialogMode(null);
  }, [targetedProduct, pendingDialogMode]);

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            className="text-2xl h-10 w-10"
            src={item.image}
            alt="Product Image"
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

  if (productsData) {
    const { pagination } = productsData;
    content = (
      <AdminLayout>
        {/* Page Header and add button section */}
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
              onSubmit={(productData, mode) => {
                if (mode === "create") {
                  createProductMutation.mutate(productData);
                }
                if (mode === "draft") {
                  createProductMutation.mutate({
                    ...productData,
                    isActive: false,
                  });
                }
              }}
            />
          }
        />
        {/* Search && Filters section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
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
          {isQueryChangedFromDefault(MainQuery) && (
            <AdminButton
              onClick={() => {
                resetUrlQuery(defaultQuery);
                setSearchInput("");
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
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
        {/* Products table */}
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
              onPageChange={onPageChange}
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

        {/* Dialog of view product */}
        <ProductDialog
          mode="view"
          open={!!viewProduct}
          onOpenChange={(open) => !open && closeProductFlow()}
          initialData={toDialogProductData(viewProduct)}
          onEditFromView={() => {
            if (viewProduct) {
              setViewProduct(null);
              setEditProduct(viewProduct);
            }
          }}
        />

        {/* Dialog of edit product */}
        <ProductDialog
          mode="edit"
          open={!!editProduct}
          onOpenChange={(open) => !open && closeProductFlow()}
          initialData={toDialogProductData(editProduct)}
          onSubmit={(data, mode) => {
            UpdateProductMutation.mutate(data);
          }}
        />

        {/* Delete Confirmation */}
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
