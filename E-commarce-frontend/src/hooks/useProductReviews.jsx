import { useMutation } from "@tanstack/react-query";
import { addProductReview } from "@/APIs/shopProductsService";
import { queryClient } from "@/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function useProductReviews(productId = null , options = {}) {
  const { toast } = useToast();

  const reviewMutation = useMutation({
    mutationFn: (payload) =>
      addProductReview({
        productId,
        verified: payload.verified,
        rating: payload.rating,
        comment: payload.comment,
        username: payload.verified ? "" : payload.username,
        email: payload.verified ? "" : payload.email,
      }),
    onMutate: () => {
      toast({
        title: "Submitting review",
        description: "Please wait, your review is being submitted.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast({
        title: "Review submitted",
        description: "Thanks for sharing your feedback.",
      });
      options.onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Could not submit review",
        description: error.message,
        variant: "destructive",
      });
      options.onError?.();
    },
  });

  function submitReview(payload) {
    if (!productId) {
      return;
    }

    reviewMutation.mutate(payload);
  }

  return {
    submitReview,
    reviewMutation,
    isSubmittingReview: reviewMutation.isPending || reviewMutation.isLoading,
    reviewError: reviewMutation.error,
  };
}
