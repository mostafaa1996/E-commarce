import StarRating from "./StarRating";
import {
  CircleUserRound,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PenSquare,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import WriteReviewDialog from "./WriteReviewDialog";
import { useMutation } from "@tanstack/react-query";
import {addProductReview} from "@/APIs/shopProductsService";

const ReviewsSection = ({ summary, reviews = [], isLoggedIn, currentUser }) => {
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const total = summary.reviewsCount;
  const buckets = ["five", "four", "three", "two", "one"];
  const reviewsPerPage = 3;
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "oldest") {
      return new Date(a.updatedAt) - new Date(b.updatedAt);
    }

    if (sort === "rating-high") {
      return b.rating - a.rating;
    }

    if (sort === "rating-low") {
      return a.rating - b.rating;
    }

    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  const totalPages = Math.max(
    1,
    Math.ceil(sortedReviews.length / reviewsPerPage),
  );
  const startIndex = (page - 1) * reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(
    startIndex,
    startIndex + reviewsPerPage,
  );

  const UpdateReviews =  useMutation(
    {
      mutationFn: async (review) => {
        return await addProductReview(review);
      },
      //TODO: implement optimistic updates
      //TODO: implement error handling
      
      //TODO: reset userReview state on success
    }
  );

  const handleSubmitReview = (payload) => {
    const review = {
      verified: payload.verified,
      rating: payload.rating,
      comment: payload.comment,
      productId: reviews[0]?.product || "",
      // username and email are optional for unverified users
      username: payload.verified ? "" : payload.username,
      email: payload.verified ? "" : payload.email,
    };
    UpdateReviews.mutate(review);
  };

  return (
    <section className="container py-12 md:py-16">
      {/* Reviews heading and primary review action */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Customer Reviews
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real feedback from verified buyers
          </p>
        </div>
        <button
          onClick={() => {
            setDialogOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:bg-primary-hover"
        >
          <PenSquare className="h-4 w-4" />
          Write a review
        </button>
      </div>

      {/* Ratings summary card with average score and distribution bars */}
      <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 shadow-card md:grid-cols-3 md:p-8">
        {/* Average rating overview */}
        <div className="flex flex-col items-center justify-center border-b border-border pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-8">
          <div className="text-6xl font-bold tracking-tight text-foreground">
            {summary.averageRating.toFixed(1)}
          </div>
          <div className="mt-2">
            <StarRating rating={summary.averageRating} size={20} />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Based on {total.toLocaleString()} reviews
          </div>
        </div>

        {/* Rating breakdown progress bars */}
        <div className="md:col-span-2">
          <div className="space-y-2.5">
            {buckets.map((k, i) => {
              const stars = 5 - i;
              const count = summary.ratingBreakdown[k] || 0;
              const pct = total ? (count / total) * 100 : 0;

              return (
                <div key={k} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-muted-foreground">
                    {stars} star
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right tabular-nums text-muted-foreground">
                    {count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews count and sorting controls */}
      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {paginatedReviews.length} of {reviews.length.toLocaleString()} reviews
        </span>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="appearance-none rounded-xl border border-border bg-background py-2 pl-4 pr-9 text-sm font-medium text-foreground transition-smooth hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="recent">Most recent</option>
            <option value="rating-high">Highest rating</option>
            <option value="rating-low">Lowest rating</option>
            <option value="oldest">Oldest</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Reviews list or empty state */}
      <div className="mt-5 space-y-4">
        {reviews.length === 0 ? (
          /* Empty reviews state */
          <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to share your experience.
            </p>
          </div>
        ) : (
          paginatedReviews.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:shadow-elevated md:p-6"
            >
              {/* Individual review card content */}
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                  <CircleUserRound className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {r.username || "Anonymous"}
                    </span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mt-1">
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  <h4 className="mt-2 font-semibold text-foreground">
                    {r.comment.split(/[.!?\n]/)[0].slice(0, 60) || "Review"}
                  </h4>
                  <p className="mt-1 text-md leading-relaxed text-muted-foreground">
                    {r.comment}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination controls for navigating review pages */}
      <div className="mt-8 flex items-center justify-center gap-1">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-smooth hover:bg-secondary disabled:opacity-40"
          aria-label="Prev"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition-smooth ${
              page === n
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-smooth hover:bg-secondary disabled:opacity-40"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <WriteReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onSubmit={handleSubmitReview}
      />
    </section>
  );
};

export default ReviewsSection;
