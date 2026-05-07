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
  Approved: "success",
  Pending: "warning",
  Rejected: "danger",
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
          name="star"
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
  const [viewCompleteComment, setViewCompleteComment] = useState(null); //trigger dialog for complete comment
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
    mutationFn: (id, status) => updateAdminProductReview(id, status),
    onMutate: () => {
      //TODO: add loading state like small spinner
    },
    onSuccess: () => {
      toast({
        title: "Review updated.",
        description: "The review has been updated.",
      });
      //TODO: update table with new status and date.
    },
  });

  const { mutateAsync: deleteReview } = useMutation({
    mutationFn: (id) => deleteAdminProductReview(id),
    onMutate: () => {
      //TODO: add loading state like small spinner
    },
    onSuccess: () => {
      toast({
        title: "Review deleted.",
        description: "The review has been deleted.",
      });
      //TODO: update table with new status and date.
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
          {item.product.title}
        </span>
      ),
    },
    { key: "customer", header: "Customer" },
    {
      key: "rating",
      header: "Rating",
      render: (item) => <StarRating rating={item.rating} />,
    },
    {
      key: "comment",
      header: "Comment",
      render: (item) => (
        <p className="text-sm text-muted-foreground max-w-[250px] truncate">
          {item.comment}
        </p>
      ),
      className: "max-w-[300px]",
    },
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <p className="text-sm text-muted-foreground">{item.updatedAt}</p>
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
      render: (item) => (
        <div className="flex gap-1">
          {item.status === "Pending" && (
            <>
              <AdminButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-success"
                onClick={() =>
                  updateReview({ id: item._id, status: "Approved" })
                }
              >
                <Icon name="check" className="h-4 w-4" />
              </AdminButton>
              <AdminButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() =>
                  updateReview({ id: item._id, status: "Rejected" })
                }
              >
                <Icon name="x" className="h-4 w-4" />
              </AdminButton>
            </>
          )}
          <AdminButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => deleteReview(item._id)}
          >
            <Icon name="trash2" className="h-4 w-4" />
          </AdminButton>
        </div>
      ),
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

  if (data && reviews.length > 0) {
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
              <SelectItem value="rejected">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <div
            className={`transition-opacity duration-200 ${
              isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <DataTable
              columns={columns}
              data={reviews}
              page={1}
              totalPages={2}
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
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
