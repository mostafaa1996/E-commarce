import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import Man_avatar from "/Man_avatar.png";
import Woman_avatar from "/woman_avatar.png";
export default function ReviewsTab({ reviews }) {
  return (
    <div className="flex flex-col gap-6">
      {reviews.map(review => (
        <ReviewItem
          key={review.id}
          name = {review.user.name || ""}
          avatar = {review.user.avatar|| Man_avatar}
          date = {review.date || ""}
          text = {review.comment || ""}
          rating = {review.rating || 0}
        />
      ))}

      <ReviewForm />
    </div>
  );
}
