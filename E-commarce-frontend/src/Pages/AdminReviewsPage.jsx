import Icon from "@/system/icons/Icon";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import useURLQuery from "@/hooks/UrlQuery";
import {
  getAdminProductsReviews,
  updateAdminProductReview,
  deleteAdminProductReview,
} from "@/APIs/adminReviews";
import Loading from "@/components/genericComponents/Loading";
import { formatTime, shortenText } from "@/utils/utils";
import InputField from "@/components/genericComponents/InputField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/adminUI/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";

const defaultQuery = {
  status: "all",
  rating: "all",
  search: "",
  page: 1,
  limit: 6,
};

const statusMap = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.rating !== defaultQuery.rating ||
    query.search !== defaultQuery.search
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="reviews"
          className={`h-3.5 w-3.5 ${
            i <= rating
              ? "fill-warning text-warning"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  let content = null;
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [viewCompleteComment, setViewCompleteComment] = useState(null); //trigger dialog for complete comment
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);
  const {
    data: reviewsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
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
    onSuccess: (data, { id, status }) => {
      toast({
        title: "Review updated.",
        description: "The review has been updated.",
      });
      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review._id === id
            ? {
                ...review,
                status,
                updatedAt: formatTime(data?.review?.updatedAt || new Date()),
              }
            : review,
        ),
      );
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
      setReviews((currentReviews) =>
        currentReviews.filter((review) => review._id !== pendingAction?.id),
      );
    },
    onSettled: () => {
      setPendingAction(null);
    },
  });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [searchInput]);

  useEffect(() => {
    updateUrlQuery({
      rating: selectedRating,
      status: selectedStatus,
      search: searchTerm,
    });
  }, [selectedRating, selectedStatus, searchTerm]);

  useEffect(() => {
    if (reviewsData?.reviews) {
      setReviews(reviewsData.reviews);
    }
  }, [reviewsData]);

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (item) => (
        <span className="font-medium text-foreground">
          {shortenText(item.product.title, 30)}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (item) => (
        <span className="font-medium text-foreground">{item.username}</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (item) => <StarRating rating={item.rating} />,
    },
    {
      key: "comment",
      header: "Comment",
      render: (item) => (
        <AdminButton
          onClick={() => {
            setViewCompleteComment(true);
            setSelectedItem(item);
          }}
          className="text-sm text-muted-foreground max-w-[250px] truncate"
          variant="ghost"
        >
          {item.comment}
        </AdminButton>
      ),
      className: "max-w-[300px]",
    },
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <p className="text-sm text-muted-foreground">{formatTime(item.date)}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={statusMap[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item) => {
        const isApproving =
          pendingAction?.id === item._id && pendingAction?.type === "approved";
        const isRejecting =
          pendingAction?.id === item._id && pendingAction?.type === "rejected";
        const isDeleting =
          pendingAction?.id === item._id && pendingAction?.type === "delete";

        return (
          <div className="flex gap-1">
            {item.status === "pending" && (
              <>
                <AdminButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-success"
                  disabled={Boolean(pendingAction)}
                  onClick={() =>
                    updateReview({ id: item._id, status: "approved" })
                  }
                >
                  {isApproving ? (
                    <Icon name="loader" className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon name="check" className="h-4 w-4 text-green" />
                  )}
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  disabled={Boolean(pendingAction)}
                  onClick={() =>
                    updateReview({ id: item._id, status: "rejected" })
                  }
                >
                  {isRejecting ? (
                    <Icon name="loader" className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon name="x" className="h-4 w-4 text-red" />
                  )}
                </AdminButton>
              </>
            )}
            <AdminButton
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              disabled={Boolean(pendingAction)}
              onClick={() => deleteReview(item._id)}
            >
              {isDeleting ? (
                <Icon name="loader" className="h-4 w-4 animate-spin" />
              ) : (
                <Icon name="trash2" className="h-4 w-4" />
              )}
            </AdminButton>
          </div>
        );
      },
    },
  ];

  if (isLoading && !reviewsData) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Products"
          description="Loading your latest customers reviews."
          breadcrumbs={[{ label: "Reviews" }]}
        />
        <Loading message="Loading reviews" fullPage />
      </AdminLayout>
    );
  }

  if (error || isError) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Reviews"
          description="We could not load your customers reviews right now."
          breadcrumbs={[{ label: "Reviews" }]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load data.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (reviewsData) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Reviews"
          description="Moderate customer reviews"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Reviews" },
          ]}
        />
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <InputField
              placeholder="Search customers or products..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {isQueryChangedFromDefault(MainQuery) && (
            <AdminButton
              onClick={() => {
                resetUrlQuery(defaultQuery);
                setSearchInput("");
                setSearchTerm("");
                setSelectedRating("all");
                setSelectedStatus("all");
              }}
              variant="ghost"
              className="w-full sm:w-auto"
            >
              Clear Filters
            </AdminButton>
          )}
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="w-full sm:w-[160px] h-auto ">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[140px] h-auto ">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {reviews && (
          <div className="relative">
            <div
              className={`transition-opacity duration-200 ${
                isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <DataTable
                columns={columns}
                data={reviews}
                page={reviewsData?.pagination?.page}
                totalPages={reviewsData?.pagination?.totalPages}
                onPageChange={(page) => updateUrlQuery({ page })}
              />
            </div>

            {isFetching && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/35 backdrop-blur-[1px]">
                <div
                  className="relative flex h-12 w-12 items-center justify-center"
                  role="status"
                  aria-live="polite"
                  aria-label="Refreshing products"
                >
                  <div className="absolute h-full w-full rounded-full border-4 border-orange-100" />
                  <div className="absolute h-full w-full animate-spin rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-400" />
                  <div className="h-6 w-6 rounded-full bg-orange-500/10 shadow-inner" />
                </div>
              </div>
            )}
          </div>
        )}

        <Dialog
          open={Boolean(viewCompleteComment && selectedItem)}
          onOpenChange={(open) => {
            setViewCompleteComment(open);
            if (!open) {
              setSelectedItem(null);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Review details</DialogTitle>
              <DialogDescription>
                Complete review information for this customer feedback.
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Username
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedItem.username || "Anonymous"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedItem.email || "No email provided"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={selectedItem.rating} />
                    <span className="text-sm text-foreground">
                      {selectedItem.rating}/5
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Comment
                  </p>
                  <p className="text-sm leading-6 text-foreground">
                    {selectedItem.comment}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
