import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCart, syncCart } from "@/APIs/CartService";
import { queryClient } from "@/queryClient";
import { useMemo, useState } from "react";

function normalizeCouponInfo(cart) {
  const couponOffer = cart?.couponOffer || {};
  const coupon = couponOffer.coupon || couponOffer;
  const discountType = coupon?.discountType || "";
  const discountValue = Number(coupon?.discountValue || 0);
  const message = couponOffer?.message || "";
  const code = coupon?.code || "";
  const isEligible =
    typeof couponOffer?.type === "string"
      ? couponOffer?.type?.toLowerCase() === "eligible"
      : Boolean(coupon.code);

  return {
    code,
    discountType,
    discountValue,
    message,
    isEligible,
  };
}

function calculateDiscount(couponInfo, totalCost) {
  const discountValue = Number(couponInfo?.discountValue);

  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return 0;
  }

  if (couponInfo.discountType.toLowerCase().trim().includes("percent")) {
    return (totalCost * (discountValue / 100)).toFixed(2);
  }

  return discountValue;
}

export default function useCart() {
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const {
    //update cartStore from database
    data: cart,
    isLoading: isLoadingCart,
    error: cartError,
  } = useQuery({
    queryKey: ["cart", { includeCouponEligibility: true }],
    queryFn: () => getCart({ includeCouponEligibility: true }),
    placeholderData: (previousData) => previousData,
  });

  const syncCartMutation = useMutation({
    mutationFn: ({ ActionType, productId, variantId, quantity, code = "" }) =>
      syncCart({ ActionType, productId, variantId, quantity, code }),
    onMutate: ({ ActionType, productId, variantId, quantity }) => {
      const cartQueryKeys = [
        ["cart", { includeCouponEligibility: false }],
        ["cart", { includeCouponEligibility: true }],
      ];
      //optimistic update
      queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCarts = queryClient.getQueriesData(cartQueryKeys);
      if (ActionType === "updateQuantity") {
        cartQueryKeys.forEach((key) => {
          queryClient.setQueryData(key, (oldCart) => {
            if (!oldCart) return null;
            const itemPrice = oldCart.items.find(
              (item) => item._id === productId && item.variantId === variantId,
            )?.price;
            const oldItemQuantity = oldCart.items.find(
              (item) => item._id === productId && item.variantId === variantId,
            )?.quantity;
            return {
              ...oldCart,
              items: oldCart.items.map((item) => {
                if (item._id === productId && item.variantId === variantId) {
                  return {
                    ...item,
                    quantity,
                    subtotal: item.price * quantity,
                  };
                }
                return item;
              }),
              totalItems: oldCart.totalItems - oldItemQuantity + quantity,
              totalPrice:
                oldCart.totalPrice -
                itemPrice * oldItemQuantity +
                itemPrice * quantity,
              updatedAt: new Date(),
            };
          });
        });
      }
      if (ActionType === "remove") {
        cartQueryKeys.forEach((key) => {
          queryClient.setQueryData(key, (oldCart) => {
            if (!oldCart) return null;
            const itemPrice = oldCart.items.find(
              (item) => item._id === productId && item.variantId === variantId,
            )?.price;
            const oldItemQuantity = oldCart.items.find(
              (item) => item._id === productId && item.variantId === variantId,
            )?.quantity;
            return {
              ...oldCart,
              items: oldCart.items.filter(
                (item) => item._id !== productId && item.variantId !== variantId,
              ),
              totalItems: oldCart.totalItems - oldItemQuantity + quantity,
              totalPrice:
                oldCart.totalPrice -
                itemPrice * oldItemQuantity +
                itemPrice * quantity,
              updatedAt: new Date(),
            };
          });
        });
      }
      if (ActionType === "clear") {
        cartQueryKeys.forEach((key) => {
          queryClient.setQueryData(key, (oldCart) => {
            if (!oldCart) return null;
            return {
              ...oldCart,
              items: [],
              totalItems: 0,
              totalPrice: 0,
              updatedAt: new Date(),
            };
          });
        });
      }
      return { previousCarts };
    },
    onError: (context) => {
      if (context.previousCart)
        queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });

  function updateItem(item, newQuantity) {
    if (newQuantity === 0) {
      removeItem();
      return;
    }
    syncCartMutation.mutate({
      ActionType: "updateQuantity",
      productId: item._id,
      variantId: item.variantId,
      quantity: newQuantity,
    });
  }

  function removeItem(item) {
    syncCartMutation.mutate({
      ActionType: "remove",
      productId: item._id,
      variantId: item.variantId,
      quantity: 0,
    });
  }
  function handleCheckout() {
    navigate("/checkout");
  }
  function handleClearCart() {
    syncCartMutation.mutate({
      ActionType: "clear",
      productId: null,
      variantId: null,
      quantity: 0,
    });
  }

  function onApplyPromo(code) {
    setAppliedPromo(true);
    syncCartMutation.mutate({
      ActionType: "applyPromo",
      productId: null,
      variantId: null,
      quantity: 0,
      code,
    });
  }

  const savings = useMemo(
    () =>
      cart?.items?.reduce(
        (sum, item) =>
          sum +
          (item.compareAtPrice
            ? (item.compareAtPrice - item.price) * item.quantity
            : 0),
        0,
      ),
    [cart?.items],
  );

  const couponInfo = useMemo(() => normalizeCouponInfo(cart), [cart]);
  const discountInMoney = useMemo(
    () => calculateDiscount(couponInfo, cart?.totalPrice),
    [couponInfo, cart?.totalPrice],
  );

  console.log(couponInfo, "couponInfo", discountInMoney, "discountInMoney");

  return {
    cart,
    isLoadingCart,
    cartError,
    handleCheckout,
    handleClearCart,
    updateItem,
    removeItem,
    promo,
    setPromo,
    appliedPromo,
    onApplyPromo,
    savings,
    discountInMoney,
    couponInfo,
  };
}
