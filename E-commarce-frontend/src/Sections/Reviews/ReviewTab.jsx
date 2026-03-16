import ReviewItem from "../../components/ProductDetails/Tabs/ReviewItem";
import ReviewForm from "../../components/ProductDetails/Tabs/ReviewForm";
import Man_avatar from "/Man_avatar.png";
import Woman_avatar from "/woman_avatar.png";
import { useLoggedInEmail } from "@/zustand_loggedIn/loggedInEmail";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { addProductReview } from "@/APIs/shopProductsService";
import { useState } from "react";
import Icon from "@/system/icons/Icon";
import { queryClient } from "@/queryClient";
import { formatTime } from "@/utils/utils";
export default function ReviewsTab({ reviews }) {
  const { id } = useParams();
  const { loggedInEmail } = useLoggedInEmail();
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const ProductReview  = useMutation(
    {
      mutationFn: addProductReview,
      onSuccess: (data) => {
        if(data && data.ok) setReviewSubmitted(true);
        queryClient.invalidateQueries({ queryKey: ["product", id] });
      },  
    }
  );

  function handleSubmit(rating, comment) {
    console.log("submitting review");
    ProductReview.mutate({id , rating, comment });
  }
  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          name={review.user.name || ""}
          avatar={review.user.avatar || Man_avatar}
          date={formatTime(review.createdAt) || formatTime(new Date())}
          text={review.comment || ""}
          rating={review.rating || 0}
        />
      ))}

      {!reviewSubmitted && <ReviewForm loggedInEmail={loggedInEmail} onSubmit={handleSubmit} />}
      {
        reviewSubmitted && (
          <div className="flex flex-col gap-6 mx-10 mb-10 justify-center items-center">
            <Icon name="checkCircle" className="w-20 h-20 text-green-500" />
            <h3 className="text-[21px] font-light tracking-wide mb-5">
              Thank you for your review
            </h3>
          </div>
        )
      }
    </div>
  );
}
