import ImageGallery from "@/components/ProductDetailsModified/ImageGallery";
import ProductInfo from "@/components/ProductDetailsModified/ProductInfo";
import VariantSelector from "@/components/ProductDetailsModified/VariantSelector";
import PurchaseCard from "@/components/ProductDetailsModified/PurchaseCard";
import ShippingCard from "@/components/ProductDetailsModified/ShippingCard";
import ReturnPolicyCard from "@/components/ProductDetailsModified/ReturnPolicyCard";
import ProductTabs from "@/components/ProductDetailsModified/ProductTabs";
import ReviewsSection from "@/components/ProductDetailsModified/ReviewsSection";
import RelatedProducts from "@/components/ProductDetailsModified/RelatedProducts";
import StickyMobileBuyBar from "@/components/ProductDetailsModified/StickyMobileBuyBar";
import { useParams } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { useLoggedInEmail } from "@/zustand_loggedIn/loggedInEmail";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useCurrency from "@/hooks/CurrencyChange";
import  useProductWishlist  from "@/hooks/useProductWishlist";
import  useProductCart  from "@/hooks/useProductCart";
import  useProductDetails from "@/hooks/useProductDetails";
import  useProductReviews from "@/hooks/useProductReviews";
import {formatTime} from "@/utils/utils";
import Loading from "@/components/genericComponents/Loading";
import { useState } from "react";

const ProductPage = () => {
  let content = null;

  const { id } = useParams();
  const { preloadedProduct , cart } = useLoaderData();
  const { loggedInEmail } = useLoggedInEmail();
  const { currency , locale , conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    product,
    productQuery,
    relatedProducts,
    relatedProductsQuery,
    selectedVariant,
    setSelectedVariant,
    galleryImages,
    handleBuyNow
  } = useProductDetails(id, preloadedProduct);
  const {
      initialCartQty,
      addToCart,
      removeFromCart,
      isInCart
    } = useProductCart(product, selectedVariant, cart);
    const {
    isInWishlist,
    toggleWishlist,
  } = useProductWishlist(product?._id , selectedVariant?._id);
  const {
    submitReview,
    isSubmittingReview,
    reviewError,
  } = useProductReviews(product?._id, {
    onSuccess: () => {
      setDialogOpen(false);
    },
    onError: () => {
      setDialogOpen(false);
    },
  });
  
  
  if (productQuery.isLoading || productQuery.isFetching)
    content = <Loading message="Loading product" fullPage />;
  if (productQuery.isError) {
    content = (
      <div className="container py-20">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load product data.</p>
          <p className="mt-2 text-sm">
            {productQuery.error?.message || "Please try again later."}
          </p>
        </div>
      </div>
    );
  }
  if (!product && !productQuery.isError) content = <p>No product found</p>;

  if (product) {
    content = (
      <div className="flex flex-col items-center min-h-screen bg-background pb-24 md:pb-0"> 
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
                <ProductInfo
                  brand={product.brand}
                  title={product.title}
                  description={product.shortDescription}
                  isActive={product.isActive}
                  isNew={product.tags?.includes("New Arrival")}
                  rating={product.reviewSummary.averageRating}
                  reviewsCount={product.reviewSummary.reviewsCount}
                  soldCount={product.soldCount}
                  viewsCount={product.viewsCount}
                  sku={selectedVariant?.sku}
                />

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
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onBuyNow={handleBuyNow}
                  isInWishlist={isInWishlist}
                  onUpdateWishlist={toggleWishlist}
                  initiallyInCart={isInCart}
                  initialQty={initialCartQty}
                  formatCurrency={format}
                  rate={rate}
                  expireDate={formatTime(selectedVariant?.expireDate)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Shipping & Returns */}
        <section className="container mt-12 grid gap-6 md:grid-cols-2 md:mt-16">
          <ShippingCard
            shipping={product.shipping}
            formatCurrency={format}
            rate={rate}
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
          submitReview={submitReview}
          isSubmittingReview={isSubmittingReview}
          reviewError={reviewError}
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
        />

        {/* Related */}
        <RelatedProducts
          items={relatedProducts}
          loading={relatedProductsQuery.isFetching || relatedProductsQuery.isLoading}
          error={relatedProductsQuery.isError}  
          formatCurrency={format}
          rate={rate}
        />

        {/* Mobile sticky bar */}
        <StickyMobileBuyBar
          variant={selectedVariant}
          currency={product.currency}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />
      </div>
    );
  }

  return <>{content}</>;
};

export default ProductPage;
