import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import ProductCard from "@/components/genericComponents/ProductCard_V";
import { useQuery , useMutation } from "@tanstack/react-query";
import { getUserWishlist } from "@/APIs/UserProfileService";
import {useCartStore} from "@/zustand_Cart/CartStore";
import { Fragment } from "react";
import { updateUserWishlist } from "@/APIs/UserProfileService";
import { queryClient } from "@/queryClient";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
export default function WishListPage() {
  let content = null;
  const {currency , locale} = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const CartStorage = useCartStore();
  const {
    data: wishList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile-wishlist"],
    queryFn: getUserWishlist,
    staleTime: 1000 * 60 * 5,
  });

  const wishListMutation = useMutation({
    mutationKey: ["profile-wishlist"],
    mutationFn: (arrOfIds) => updateUserWishlist(arrOfIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-wishlist"] });
    },
  });
  
  function handleAddToCart(product) {
    CartStorage.addItem(product, 1);
  }
  function handleOnRemove(productId){
    const arrOfIds = [productId];
    wishListMutation.mutate(arrOfIds);
  }
  function handleClearWishList(arrOfIds){
    wishListMutation.mutate(arrOfIds);
  }
  if (isLoading) content = <p>Loading...</p>;
  if (error) content = <p>Failed to load profile</p>;
  if (!wishList) content = <p>No profile found</p>;
  if (wishList) {
    const wishListIds = wishList.wishlist?.map((item) => item._id);
    content = (
      <>
        <BaseSection>
          <UserNestedRoutesHeader
            className="w-full"
            iconName="wishlist"
            title="My WishList"
            info= {`${wishList.wishlist?.length || 0} products`}
            buttonText="Clear WishList"
            onClick={() => handleClearWishList(wishListIds)}
          />

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-20 sm:gap-15 gap-10 w-full justify-items-center">
            {wishList &&
              wishList.wishlist?.map((product) => (
                <Fragment key={product._id}>
                  <ProductCard
                    image={product.images[0].url}
                    title={product.title}
                    price={format(product.price)}
                    oldPrice={product.originalPrice}
                    category={product.category}
                    onAdd = {() => handleAddToCart( product)}
                    onRemove = {() => handleOnRemove(product._id)}
                    NavigationLink={`/shop/products/${product._id}`}
                    variant={"ShowWishlistStyle"}
                  />
                </Fragment>
              ))}
          </div>
        </BaseSection>
      </>
    );
  }
  return <>{content}</>;
}
