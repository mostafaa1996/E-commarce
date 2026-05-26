import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getProduct,
  updateProduct,
} from "@/APIs/adminProducts";
import useURLQuery from "@/hooks/UrlQuery";
import { queryClient } from "@/queryClient";
import { useToast } from "@/hooks/use-toast";

const defaultQuery = {
  status: "all",
  category: "all",
  search: "",
  page: 1,
  limit: 8,
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.category !== defaultQuery.category ||
    query.search !== defaultQuery.search
  );
}

function getDefaultVariant(product) {
  if (!product?.hasVariants) return product?.variants?.[0];
  return product?.variants?.find((variant) => variant._id === product?.defaultVariantId);
}

export function toDialogProductData(product) {
  const defaultVariant = getDefaultVariant(product);

  return {
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
    originalPrice: String(defaultVariant?.compareAtPrice || "").replace(
      /[^0-9.]/g,
      "",
    ),
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
    stock: product?.hasVariants
      ? String(product?.inventory?.totalStock || 0)
      : String(defaultVariant?.stock || 0),
    sku: defaultVariant?.sku || "",
    shipping: product?.shipping || undefined,
    returnPolicy: product?.returnPolicy || undefined,
    tags: product?.tags || [],
    reviewSummary: product?.reviewSummary || undefined,
  };
}

export default function useAdminProductsPage() {
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [pendingDialogMode, setPendingDialogMode] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
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
    mutationFn: createProduct,
    onMutate: (product) => {
      toast({
        title: "Creating Product",
        description: "We are creating your product.",
      });
      return { productName: product.title || "Untitled Product" };
    },
    onError: (error) => {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (_data, product) => {
      toast({
        title: "Product created",
        description: `"${product.title}" has been created.`,
      });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setSelectedProductId(null);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (product) => updateProduct(product.id, product),
    onMutate: () => {
      toast({
        title: "Updating Product",
        description: "We are saving your product changes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (_data, product) => {
      toast({
        title: "Product updated",
        description: `"${product.title || product.name}" has been saved.`,
      });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminProduct", product.id] });
      closeProductFlow();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (product) => deleteProduct(product.id),
    onMutate: () => {
      toast({
        title: "Deleting Product",
        description: "We are deleting your product.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (_data, product) => {
      toast({
        title: "Product deleted",
        description: `"${product.name}" has been removed.`,
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
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
      category: selectedCategory,
      status: selectedStatus,
      search: searchTerm,
    });
  }, [selectedCategory, selectedStatus, searchTerm, updateUrlQuery]);

  function closeProductFlow() {
    setPendingDialogMode(null);
    setSelectedProductId(null);
  }

  const openEdit = (product) => {
    setSelectedProductId(product.id);
    setPendingDialogMode("edit");
  };

  const openView = (product) => {
    setSelectedProductId(product.id);
    setPendingDialogMode("view");
  };

  const handleDelete = () => {
    if (!productToDelete) return;

    deleteProductMutation.mutate(productToDelete);
    setProductToDelete(null);
  };

  const handleCreateProduct = (productData, mode) => {
    createProductMutation.mutate({
      ...productData,
      isActive: mode === "draft" ? false : productData.isActive,
    });
  };

  const handleUpdateProduct = (productData) => {
    updateProductMutation.mutate(productData);
  };

  const resetFilters = () => {
    resetUrlQuery(defaultQuery);
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const viewProduct = pendingDialogMode === "view" ? targetedProduct : null;
  const editProduct = pendingDialogMode === "edit" ? targetedProduct : null;
  const currentPage = productsData?.pagination?.page || MainQuery.page || 1;

  const dialogProductData = useMemo(() => {
    if (viewProduct) return toDialogProductData(viewProduct);
    if (editProduct) return toDialogProductData(editProduct);
    return null;
  }, [editProduct, viewProduct]);

  return {
    productsData,
    products: productsData?.products || [],
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
    MainQuery,
    updateUrlQuery,
    currentPage,
    resetFilters,
    isQueryChanged: isQueryChangedFromDefault(MainQuery),
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
  };
}
