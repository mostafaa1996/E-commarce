import { getCart, syncCart } from "@/APIs/CartService";
import { getUserWishlist, updateUserWishlist } from "@/APIs/UserProfileService";
import useCurrency from "@/hooks/CurrencyChange";
import { queryClient } from "@/queryClient";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

function getWishlistItemKey(productId, variantId) {
  return `${productId || ""}:${variantId || ""}`;
}

export default function useWishlistPage() {
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const [addedToCartKeys, setAddedToCartKeys] = useState([]);

  const wishlistQuery = useQuery({
    queryKey: ["profile-wishlist"],
    queryFn: getUserWishlist,
    staleTime: 1000 * 60 * 5,
  });

  const cartQuery = useQuery({
    queryKey: ["cart", { includeCouponEligibility: false }],
    queryFn: getCart,
    placeholderData: (previousData) => previousData,
  });

  const wishlistMutation = useMutation({
    mutationKey: ["profile-wishlist"],
    mutationFn: (arrOfIds) => updateUserWishlist(arrOfIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-wishlist"] });
    },
  });

  const syncCartMutation = useMutation({
    mutationFn: ({ ActionType, productId, variantId, quantity }) =>
      syncCart({ ActionType, productId, variantId, quantity }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
    onSuccess: (_data, variables) => {
      const itemKey = getWishlistItemKey(
        variables.productId,
        variables.variantId,
      );

      setAddedToCartKeys((currentKeys) =>
        currentKeys.includes(itemKey) ? currentKeys : [...currentKeys, itemKey],
      );
    },
  });

  const wishedProducts = useMemo(
    () => wishlistQuery.data?.wishedProducts || [],
    [wishlistQuery.data],
  );

  function formatPrice(price) {
    return format(price * rate);
  }

  function handleAddToCart(productId, variantId) {
    if (isAddedToCart(productId, variantId)) {
      return;
    }

    syncCartMutation.mutate({
      ActionType: "updateQuantity",
      productId,
      variantId,
      quantity: 1,
    });
  }

  function handleRemoveFromWishlist(productId, variantId) {
    wishlistMutation.mutate([{ productId, variantId }]);
  }

  function handleClearWishlist() {
    wishlistMutation.mutate([]);
  }

  function isAddingToCart(productId, variantId) {
    const variables = syncCartMutation.variables;

    return (
      syncCartMutation.isPending &&
      variables?.productId === productId &&
      variables?.variantId === variantId
    );
  }

  function isAddedToCart(productId, variantId) {
    const itemKey = getWishlistItemKey(productId, variantId);
    const existsInCart = cartQuery.data?.items?.some(
      (item) =>
        item?._id?.toString() === productId?.toString() &&
        item?.variantId?.toString() === variantId?.toString(),
    );

    return existsInCart || addedToCartKeys.includes(itemKey);
  }

  function getAddToCartButtonState(productId, variantId) {
    if (isAddingToCart(productId, variantId)) {
      return {
        isDisabled: true,
        text: "Adding...",
      };
    }

    if (isAddedToCart(productId, variantId)) {
      return {
        isDisabled: true,
        text: "Added to Cart",
      };
    }

    return {
      isDisabled: false,
      text: "Add to Cart",
    };
  }

  return {
    wishList: wishlistQuery.data,
    wishedProducts,
    isLoading: wishlistQuery.isLoading,
    error: wishlistQuery.error,
    formatPrice,
    getAddToCartButtonState,
    handleAddToCart,
    handleRemoveFromWishlist,
    handleClearWishlist,
  };
}
