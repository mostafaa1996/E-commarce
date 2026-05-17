import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserWishlist,
  updateUserWishlist,
} from "@/APIs/UserProfileService";
import { queryClient } from "@/queryClient";
import { useLoggedInEmail } from "@/zustand_loggedIn/loggedInEmail";
import { useToast } from "@/hooks/use-toast";

export default function useProductWishlist(productId) {
  const { toast } = useToast();
  const { loggedInEmail } = useLoggedInEmail();
  const isLoggedIn = Boolean(loggedInEmail);

  const wishlistQuery = useQuery({
    queryKey: ["profile-wishlist"],
    queryFn: getUserWishlist,
    enabled: isLoggedIn,
  });

  const isInWishlist = useMemo(() => {
    if (!productId || !wishlistQuery.data?.wishlist) {
      return false;
    }

    return wishlistQuery.data.wishlist.some(
      (item) => item._id.toString() === productId.toString(),
    );
  }, [productId, wishlistQuery.data]);

  const wishlistMutation = useMutation({
    mutationKey: ["profile-wishlist"],
    mutationFn: (arrOfIds) => updateUserWishlist(arrOfIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-wishlist"] });
    },
  });

  function toggleWishlist() {
    if (!productId || !isLoggedIn) {
      return;
    }

    wishlistMutation.mutate([productId]);

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
