import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCart, syncCart } from "@/APIs/CartService";
import { queryClient } from "@/queryClient";
import { useMemo , useState } from "react";

function getFirstValue(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
}

function normalizeCouponInfo(cart) {
  const source = getFirstValue(
    cart?.coupon,
    cart?.couponInfo,
    cart?.eligibleCoupon,
    cart?.promotion,
    cart?.promo,
  );

  const couponSource = typeof source === "object" ? source : {};
  const discountValue = getFirstValue(
    couponSource.discountValue,
    couponSource.value,
    couponSource.amount,
    cart?.couponValue,
    cart?.couponDiscount,
    cart?.discount,
  );
  const message = getFirstValue(
    couponSource.message,
    couponSource.description,
    couponSource.encouragement,
    couponSource.eligibilityMessage,
    cart?.couponMessage,
    cart?.promotionMessage,
    cart?.discountMessage,
  );
  const isEligible = getFirstValue(
    couponSource.isEligible,
    couponSource.eligible,
    couponSource.canApply,
    cart?.isCouponEligible,
    cart?.eligibleForCoupon,
  );

  return {
    code: getFirstValue(couponSource.code, cart?.couponCode),
    discountType: getFirstValue(
      couponSource.discountType,
      couponSource.type,
      cart?.couponDiscountType,
    ),
    discountValue,
    message,
    isEligible: isEligible ?? discountValue > 0,
  };
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
    queryKey: ["cart"],
    queryFn: () => getCart(),
    placeholderData: (previousData) => previousData,
  });

  const syncCartMutation = useMutation({
    mutationFn: ({ ActionType, productId, variantId, quantity }) =>
      syncCart({ ActionType, productId, variantId, quantity }),
    onMutate: ({ ActionType, productId, variantId, quantity }) => {
      //optimistic update
      queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      if (ActionType === "updateQuantity") {
        queryClient.setQueryData(["cart"], (oldCart) => {
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
            totalPrice: (oldCart.totalPrice - itemPrice * oldItemQuantity) + itemPrice * quantity,
            updatedAt: new Date(),
          };
        });
      }
      if (ActionType === "remove") {
        queryClient.setQueryData(["cart"], (oldCart) => {
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
            totalPrice: (oldCart.totalPrice - itemPrice * oldItemQuantity) + itemPrice * quantity,
            updatedAt: new Date(),
          };
        });
      }
      if (ActionType === "clear") {
        queryClient.setQueryData(["cart"], (oldCart) => {
          if (!oldCart) return null;
          return {
            ...oldCart,
            items: [],
            totalItems: 0,
            totalPrice: 0,
            updatedAt: new Date(),
          };
        });
      }
      return { previousCart };
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

  return {
    cart, isLoadingCart, cartError,
    handleCheckout,
    handleClearCart,
    updateItem,
    removeItem,
    promo,
    setPromo,
    appliedPromo,
    setAppliedPromo,
    savings,
    couponInfo,
  };
}
