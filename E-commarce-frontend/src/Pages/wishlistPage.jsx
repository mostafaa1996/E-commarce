import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import ProductCard from "@/components/genericComponents/ProductCard_V";
import { Fragment } from "react";
import ProfilePageState from "@/components/genericComponents/ProfilePageState";
import useWishlistPage from "@/hooks/useWishlistPage";

export default function WishListPage() {
  let content = null;
  const {
    wishList,
    wishedProducts,
    isLoading,
    error,
    formatPrice,
    getAddToCartButtonState,
    handleAddToCart,
    handleRemoveFromWishlist,
    handleClearWishlist,
  } = useWishlistPage();

  if (isLoading) {
    content = (
      <BaseSection>
        <ProfilePageState type="loading" loadingMessage="Loading wishlist" />
      </BaseSection>
    );
  }

  if (error) {
    content = (
      <BaseSection>
        <ProfilePageState
          type="error"
          title="Error loading wishlist"
          message={error.message}
        />
      </BaseSection>
    );
  }

  if (!wishList && !isLoading && !error) {
    content = (
      <BaseSection>
        <ProfilePageState
          title="No wishlist found"
          message="Your wishlist data is not available right now."
        />
      </BaseSection>
    );
  }

  if (wishList) {
    content = (
      <>
        <BaseSection>
          <UserNestedRoutesHeader
            className="w-full"
            iconName="wishlist"
            title="My WishList"
            info={`${wishedProducts.length} products`}
            buttonText="Clear WishList"
            onClick={handleClearWishlist}
          />

          <div className="grid w-full grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-10">
            {wishedProducts.length > 0 ? (
              wishedProducts.map((product) => {
                const addToCartButton = getAddToCartButtonState(
                  product.productId,
                  product.variantId,
                );

                return (
                  <Fragment key={product.productId}>
                    <ProductCard
                      image={product.image}
                      title={product.title}
                      price={formatPrice(product.price)}
                      oldPrice={formatPrice(product.compareAtPrice)}
                      category={product.category}
                      addButtonText={addToCartButton.text}
                      isAddDisabled={addToCartButton.isDisabled}
                      onAdd={() =>
                        handleAddToCart(product.productId, product.variantId)
                      }
                      onRemove={() =>
                        handleRemoveFromWishlist(
                          product.productId,
                          product.variantId,
                        )
                      }
                      NavigationLink={`/shop/products/${product.productId}?variantId=${product.variantId}`}
                      variant={"ShowWishlistStyle"}
                    />
                  </Fragment>
                );
              })
            ) : (
              <div className="col-span-full w-full">
                <ProfilePageState
                  title="Your wishlist is empty"
                  message="Products you save will appear here."
                />
              </div>
            )}
          </div>
        </BaseSection>
      </>
    );
  }
  return <>{content}</>;
}
