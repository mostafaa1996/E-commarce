import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProductById,
  getRelatedProductsForProductById,
} from "@/APIs/shopProductsService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function useProductDetails(id, preloadedProduct) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    initialData: preloadedProduct,
  });

  const product = productQuery.data;

  const relatedProductsQuery = useQuery({
    queryKey: ["related-products", id],
    queryFn: () => getRelatedProductsForProductById(product),
    enabled: Boolean(product),
    staleTime: 1000 * 60 * 5,
  });

  const defaultVariant = useMemo(() => {
    if (!product?.variants?.length) {
      return null;
    }

    return (
      product.variants.find(
        (variant) => variant._id === product.defaultVariantId,
      ) || product.variants[0]
    );
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) {
      return null;
    }

    return (
      product.variants.find((variant) => variant._id === selectedVariantId) ||
      defaultVariant
    );
  }, [defaultVariant, product, selectedVariantId]);

  const setSelectedVariant = useCallback((variant) => {
    setSelectedVariantId(variant?._id ?? null);
  }, []);

  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    if (!selectedVariant?.images?.length) {
      return product.images || [];
    }

    const productImages = product.images || [];
    const variantImages = selectedVariant.images;

    return [
      ...variantImages,
      ...productImages.filter(
        (productImage) =>
          !variantImages.some(
            (variantImage) => variantImage.url === productImage.url,
          ),
      ),
    ];
  }, [product, selectedVariant]);

  const handleBuyNow = (qty) => {
    toast({
      title: "Redirecting to checkout…",
      description: `${qty} × ${product.title}`,
    });
    navigate("/checkout", {
      state: {
        source: "buy-now",
        from: `/product/${product._id}`,
        product: {
          productId: product._id,
          variantId: selectedVariant._id,
          quantity: qty,
        },
      },
    });
  };

  return {
    product,
    productQuery,
    relatedProducts: relatedProductsQuery.data,
    relatedProductsQuery,
    selectedVariant,
    setSelectedVariant,
    galleryImages,
    handleBuyNow,
  };
}
