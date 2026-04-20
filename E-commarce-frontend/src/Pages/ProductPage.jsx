import { useMemo, useState, useEffect } from "react";
import TopNav from "@/components/ProductDetailsModified/TopNav";
import Breadcrumbs from "@/components/ProductDetailsModified/Breadcrumbs";
import ImageGallery from "@/components/ProductDetailsModified/ImageGallery";
import StarRating from "@/components/ProductDetailsModified/StarRating";
import VariantSelector from "@/components/ProductDetailsModified/VariantSelector";
import PurchaseCard from "@/components/ProductDetailsModified/PurchaseCard";
import ShippingCard from "@/components/ProductDetailsModified/ShippingCard";
import ReturnPolicyCard from "@/components/ProductDetailsModified/ReturnPolicyCard";
import ProductTabs from "@/components/ProductDetailsModified/ProductTabs";
import ReviewsSection from "@/components/ProductDetailsModified/ReviewsSection";
import RelatedProducts from "@/components/ProductDetailsModified/RelatedProducts";
import StickyMobileBuyBar from "@/components/ProductDetailsModified/StickyMobileBuyBar";
import { Eye, Flame, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import {
  getProductById,
  getRelatedProductsForProductById,
} from "@/APIs/shopProductsService";
import { getUserWishlist } from "@/APIs/UserProfileService";
import { useLoggedInEmail } from "@/zustand_loggedIn/loggedInEmail";
import { queryClient } from "../queryClient";
import { syncCart } from "@/APIs/CartService";
import { updateUserWishlist } from "@/APIs/UserProfileService";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  let content = null;

  const { id } = useParams();
  const { preloadedProduct , cart } = useLoaderData();
  const { loggedInEmail } = useLoggedInEmail();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const {
    data: product,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    initialData: preloadedProduct,
  });

  const {
    data: relatedProducts,
    isLoading: isLoadingRelatedProducts,
    isFetching: isFetchingRelatedProducts,
    error: errorRelatedProducts,
  } = useQuery({
    queryKey: ["related-products", id],
    queryFn: () => getRelatedProductsForProductById(product),
    enabled: !!product,
    staleTime: 1000 * 60 * 5,
  });

  const { data: wishlist, isLoading: isLoadingWishlist } = useQuery({
    queryKey: ["profile-wishlist"],
    queryFn: getUserWishlist,
  });

  const updateWishlist = useMutation({
    mutationKey: ["profile-wishlist"],
    mutationFn: (arrOfIds) => updateUserWishlist(arrOfIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-wishlist"] });
    },
  });

  const UpdateCart = useMutation({
    mutationFn: ({ ActionType, productId, variantId, quantity }) =>
      syncCart({ ActionType, productId, variantId, quantity }),
    onMutate: async ({ ActionType, productId, variantId, quantity }) => {
      //optimistic update
      queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData(["cart"], (oldCart) => {
        if (!oldCart) return oldCart;
        const oldItems = oldCart.items || [];

        if (ActionType === "add") {
          return {
            ...oldCart,
            items: [...oldItems, { _id: productId, quantity, variantId }],
          };
        }

        if (ActionType === "remove") {
          return {
            ...oldCart,
            items: oldItems.filter(
              (item) => item._id !== productId && item.variantId !== variantId,
            ),
          };
        }

        return oldCart;
      });
      return { previousCart };
    },
    onError: (context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });

  const defaultVariant = useMemo(
    () =>
      product.variants.find((v) => v._id === product.defaultVariantId) ||
      product.variants[0],
    [product],
  );

  const cartItems = cart?.items ?? [];
  const matchingCartItem = cartItems.find(
    (item) =>
      item._id === product?._id && item.variantId === selectedVariant?._id,
  );
  const isInCart = Boolean(matchingCartItem);
  const initialCartQty = matchingCartItem?.quantity ?? 1;

  useEffect(() => {
    if (defaultVariant) {
      // Use variant images if present, fallback to product images
      const galleryImages = defaultVariant.images?.length
        ? [
            ...defaultVariant.images,
            ...product.images.filter(
              (p) => !defaultVariant.images.some((i) => i.url === p.url),
            ),
          ]
        : product.images;
      setGalleryImages(galleryImages);
      setSelectedVariant(defaultVariant);
    }
  }, [defaultVariant, product, selectedVariant]);

  if(product){
    console.log(product);
  }

  const handleAddToCart = (qty) => {
    toast({
      title: "Added to cart",
      description: `${qty} × ${product.title} (${selectedVariant.attributes.storage}, ${selectedVariant.attributes.color?.name})`,
    });
    UpdateCart.mutate({
      ActionType: "add",
      productId: product._id,
      variantId: selectedVariant._id,
      quantity: qty,
    });
  };

  function handleRemoveFromCart() {
    toast({
      title: "Removed from cart",
      description: `${product.title} (${selectedVariant.attributes.storage}, ${selectedVariant.attributes.color?.name})`,
    });
    UpdateCart.mutate({
      ActionType: "remove",
      productId: product._id,
      variantId: selectedVariant._id,
      quantity: 0,
    });
  }
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

  function handleUpdateWishlist() {
    updateWishlist.mutate([product._id]);
  }

  if (isLoadingProduct || isFetchingProduct || isLoadingWishlist)
    content = <p>Loading...</p>;
  if (error) content = <p>Failed to load product</p>;
  if (!product) content = <p>No product found</p>;
  if (product && wishlist) {
    const isInWishlist =
      wishlist?.wishlist.some(
        (item) => item._id.toString() === product._id.toString(),
      ) ?? false;
    content = (
      <div className="flex flex-col items-center min-h-screen bg-background pb-24 md:pb-0">
        <TopNav />
        <Breadcrumbs
          items={[
            {
              label: product.sourceCategoryName?.split(" > ")[0] || "Shop",
              href: "#",
            },
            { label: product.category, href: "#" },
            { label: product.title },
          ]}
        />

        {/* HERO */}
        <section className="container py-20 animate-fade-in">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <ImageGallery images={galleryImages} alt={product.title} />
            </div>

            {/* Info */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Brand + status */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    {product.brand}
                  </span>
                  {product.isActive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Available
                    </span>
                  )}
                  {product.tags?.includes("New Arrival") && (
                    <span className="inline-flex items-center rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background">
                      New
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
                    {product.title}
                  </h1>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Rating + meta */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={product.reviewSummary.averageRating}
                      size={16}
                      showValue
                    />
                    <a
                      href="#reviews"
                      className="text-muted-foreground hover:text-primary hover:underline"
                    >
                      ({product.reviewSummary.reviewsCount.toLocaleString()}{" "}
                      reviews)
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Flame className="h-4 w-4 text-primary" />
                    <span>
                      <strong className="text-foreground">
                        {product.soldCount.toLocaleString()}
                      </strong>{" "}
                      sold
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{product.viewsCount.toLocaleString()} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  <span>SKU:</span>
                  <code className="rounded-md bg-secondary px-2 py-0.5 font-mono text-foreground">
                    {selectedVariant.sku}
                  </code>
                </div>

                {/* Variants */}
                {product.hasVariants && (
                  <div className="border-t border-border pt-6">
                    <VariantSelector
                      variants={product.variants}
                      selected={selectedVariant}
                      onSelect={setSelectedVariant}
                    />
                  </div>
                )}

                {/* Purchase card */}
                <PurchaseCard
                  variant={selectedVariant}
                  currency={product.currency}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onBuyNow={handleBuyNow}
                  onWishlist={isInWishlist}
                  onUpdateWishlist={handleUpdateWishlist}
                  initiallyInCart={isInCart}
                  initialQty={initialCartQty}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Shipping & Returns */}
        <section className="container mt-12 grid gap-6 md:grid-cols-2 md:mt-16">
          <ShippingCard
            shipping={product.shipping}
            currency={product.currency}
          />
          <ReturnPolicyCard policy={product.returnPolicy} />
        </section>

        {/* Tabs */}
        <ProductTabs product={product} />

        {/* Tags */}
        <section className="container pb-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <a
                key={t}
                href="#"
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-smooth hover:border-primary hover:bg-primary-soft hover:text-primary"
              >
                #{t}
              </a>
            ))}
          </div>
        </section>

        {/* Reviews */}

        <ReviewsSection
          summary={product.reviewSummary}
          reviews={product.reviews}
          isLoggedIn={loggedInEmail !== null}
          currentUser={loggedInEmail}
        />

        {/* Related */}
        <RelatedProducts
          items={relatedProducts}
          loading={isFetchingRelatedProducts || isLoadingRelatedProducts}
          error={errorRelatedProducts}  
        />

        {/* Footer */}
        <footer className="w-full border-t border-border bg-secondary/30 py-10">
          <div className="container text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShopLite. Crafted with care.
          </div>
        </footer>

        {/* Mobile sticky bar */}
        <StickyMobileBuyBar
          variant={selectedVariant}
          currency={product.currency}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>
    );
  }

  return <>{content}</>;
};

export default ProductPage;
