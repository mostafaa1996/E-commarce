import ReviewCard from "../genericComponents/ReviewCard";
import ShowItemsTemplate from "../genericComponents/showItemsTemplate";
import { reviews } from "../../src/Data/reviews";

export default function ReviewsSection() {
  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-6 w-[90%] justify-self-center">
        <h2 className="sm:text-[30px] text-[20px] tracking-widest text-[#272727] font-extralight uppercase">
          Customers Reviews
        </h2>
        <div
          className="flex-1 h-[12px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #D4D4D4 0 2px, transparent 2px 10px)",
          }}
        />
      </div>
      {/* Reviews grid */}
      <ShowItemsTemplate className="bg-white">
        <section className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.name}
                  Reviewtext={review.text}
                  name={review.name}
                  rating={review.rating}
                />
              ))}
            </div>
          </div>
        </section>
      </ShowItemsTemplate>
    </section>
  );
}
