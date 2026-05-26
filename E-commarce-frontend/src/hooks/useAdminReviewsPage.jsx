import {
  deleteAdminProductReview,
  getAdminProductsReviews,
  updateAdminProductReview,
} from "@/APIs/adminReviews";
import useURLQuery from "@/hooks/UrlQuery";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const defaultQuery = {
  status: "all",
  rating: "all",
  search: "",
  page: 1,
  limit: 6,
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.rating !== defaultQuery.rating ||
    query.search !== defaultQuery.search
  );
}

export default function useAdminReviewsPage() {
  const { toast } = useToast();
  const [pendingAction, setPendingAction] = useState(null);
  const [viewCompleteComment, setViewCompleteComment] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);

  const reviewsQuery = useQuery({
    queryKey: ["adminReviews", MainQuery],
    queryFn: () => getAdminProductsReviews(MainQuery),
    placeholderData: (previousData) => previousData,
    keepPreviousData: true,
  });

  const { mutateAsync: updateReview } = useMutation({
    mutationFn: ({ id, status }) => updateAdminProductReview(id, status),
    onMutate: ({ id, status }) => {
      setPendingAction({ id, type: status });
    },
    onSuccess: () => {
      toast({
        title: "Review updated.",
        description: "The review has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
    onSettled: () => {
      setPendingAction(null);
    },
  });

  const { mutateAsync: deleteReview } = useMutation({
    mutationFn: (id) => deleteAdminProductReview(id),
    onMutate: (id) => {
      setPendingAction({ id, type: "delete" });
    },
    onSuccess: () => {
      toast({
        title: "Review deleted.",
        description: "The review has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
    onSettled: () => {
      setPendingAction(null);
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    updateUrlQuery({
      rating: selectedRating,
      status: selectedStatus,
      search: searchTerm,
    });
  }, [selectedRating, selectedStatus, searchTerm, updateUrlQuery]);

  function resetFilters() {
    resetUrlQuery(defaultQuery);
    setSearchInput("");
    setSearchTerm("");
    setSelectedRating("all");
    setSelectedStatus("all");
  }

  return {
    reviewsData: reviewsQuery.data,
    reviews: reviewsQuery.data?.reviews || [],
    isLoading: reviewsQuery.isLoading,
    isFetching: reviewsQuery.isFetching,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    pendingAction,
    viewCompleteComment,
    setViewCompleteComment,
    selectedItem,
    setSelectedItem,
    selectedRating,
    setSelectedRating,
    selectedStatus,
    setSelectedStatus,
    searchInput,
    setSearchInput,
    updateReview,
    deleteReview,
    updateUrlQuery,
    resetFilters,
    isQueryChanged: isQueryChangedFromDefault(MainQuery),
  };
}
