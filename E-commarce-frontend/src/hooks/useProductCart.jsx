import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCart, syncCart } from "@/APIs/CartService";
import { queryClient } from "@/queryClient";
import { isError } from "react-query";
import { useToast } from "@/hooks/use-toast";

export default function useProductCart(product, selectedVariant, preloadedCart) {
  const { toast } = useToast();
  const cartQuery = useQuery({
    queryKey: ["cart", { includeCouponEligibility: false }],
    queryFn: getCart,
    initialData: preloadedCart || undefined,
    enabled: Boolean(preloadedCart),
  });

  const cart = cartQuery.data || preloadedCart || null;

  const matchingCartItem = useMemo(() => {
    const cartItems = cart?.items || [];

    return cartItems.find(
      (item) =>
        item._id === product?._id && item.variantId === selectedVariant?._id,
    );
  }, [cart, product?._id, selectedVariant?._id]);

  const cartMutation = useMutation({
    mutationFn: ({ ActionType, productId, variantId, quantity }) =>
      syncCart({ ActionType, productId, variantId, quantity }),
    onMutate: async ({ ActionType, productId, variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (oldCart) => {
        if (!oldCart) {
          return oldCart;
        }

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
              (item) =>
                item._id !== productId || item.variantId !== variantId,
            ),
          };
        }

        return oldCart;
      });

      return { previousCart };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });

  function addToCart(quantity) {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.title} (${selectedVariant.sku})`,
    })
    cartMutation.mutate({
      ActionType: "updateQuantity",
      productId: product._id,
      variantId: selectedVariant._id,
      quantity,
    });
  }

  function removeFromCart() {
    toast({
      title: "Removed from cart",
      description: `${product.title} (${selectedVariant.sku})`,
    })
    cartMutation.mutate({
      ActionType: "remove",
      productId: product._id,
      variantId: selectedVariant._id,
      quantity: 0,
    });
  }

  return {
    matchingCartItem,
    initialCartQty: matchingCartItem?.quantity ?? 1,
    addToCart,
    removeFromCart,
    isInCart: Boolean(matchingCartItem),
    isLoadingCart: cartQuery.isLoading,
    isFetchingCart: cartQuery.isFetching,
    isErrorCart: isError(cartQuery.error),
    isUpdatingCart: cartMutation.isPending,
  };
}
