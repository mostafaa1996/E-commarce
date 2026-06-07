import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserWishlist,
  updateUserWishlist,
} from "@/APIs/UserProfileService";
import { queryClient } from "@/queryClient";
import { useAuthStore } from "@/zustand_auth/authStore";
import { useToast } from "@/hooks/use-toast";

export default function useProductWishlist(productId, variantId) {
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();

  const wishlistQuery = useQuery({
    queryKey: ["profile-wishlist"],
    queryFn: getUserWishlist,
    enabled: isLoggedIn,
  });

  const isInWishlist = useMemo(() => {
    if (!productId || !variantId || !wishlistQuery.data?.wishedProducts) {
      return false;
    }

    return wishlistQuery.data.wishedProducts.some((item) => {
      return (
        item?.productId?.toString() === productId.toString() &&
        item?.variantId?.toString() === variantId.toString()
      );
    });
  }, [productId, variantId, wishlistQuery.data]);

  const wishlistMutation = useMutation({
    mutationKey: ["profile-wishlist"],
    mutationFn: (arrOfIds) => updateUserWishlist(arrOfIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-wishlist"] });
    },
  });

  function toggleWishlist() {
    if (!productId || !variantId || !isLoggedIn) {
      return;
    }

    wishlistMutation.mutate([{ productId, variantId }]);

    if (isInWishlist) {
      toast({
        title: "Removed from wishlist",
        description: `${productId}`,
      });
    } else {
      toast({
        title: "Added to wishlist",
        description: `${productId}`,
      });
    }
  }

  return {
    wishlist: wishlistQuery.data,
    wishlistQuery,
    wishlistMutation,
    isInWishlist,
    isLoggedIn,
    toggleWishlist,
  };
}
