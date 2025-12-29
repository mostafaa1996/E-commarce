import ReviewCard from "../genericComponents/ReviewCard";
import ShowItemsTemplate from "../genericComponents/showItemsTemplate";
const reviews = [
  {
    name: "Emma Chamberlin",
    rating: 5,
    text: "I stumbled upon this tech store while searching for a new laptop, and I couldn't be happier with my experience! The staff was incredibly knowledgeable and guided me through the process of choosing the perfect device for my needs.",
  },
  {
    name: "Thomas John",
    rating: 5,
    text: "This tech store is my go-to for all things tech! Whether it's a new smartphone, accessories, or even troubleshooting advice, they've always got me covered. The staff is friendly, and their expertise is unmatched.",
  },
  {
    name: "Kevin Bryan",
    rating: 5,
    text: "I recently purchased a smartwatch from this tech store, and I'm absolutely thrilled with my purchase! Not only did they have an extensive selection, but their team helped me find the perfect fit for my lifestyle.",
  },
];

export default function ReviewsSection() {
  return (
    <ShowItemsTemplate className="bg-white">
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
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
          <div
            className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
        "
          >
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
  );
}
