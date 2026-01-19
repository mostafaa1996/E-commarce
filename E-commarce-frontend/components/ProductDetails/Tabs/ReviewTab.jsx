import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
export default function ReviewsTab({ reviews }) {
  return (
    <div className="flex flex-col gap-6">
      {reviews.map(review => (
        <ReviewItem
          key={review.id}
          {...review}
        />
      ))}

      <ReviewForm />
    </div>
  );
}
