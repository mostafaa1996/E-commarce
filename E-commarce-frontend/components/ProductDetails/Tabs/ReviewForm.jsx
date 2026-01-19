import Button from "../../genericComponents/Button";
import InputField from "../../genericComponents/InputField";
import TextArea from "../../genericComponents/TextArea";
import lightstar from "/star.svg";
import dimmedStar from "/dimmedStar.svg";
import { useRef, useState } from "react";
export default function ReviewForm() {
  const ratingButtonRef = useRef(null);
  const [YourRating, setYourRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  return (
    <div className="flex flex-col gap-6 m-10">
      <h3 className="text-[21px] font-light tracking-wide mb-5">
        ADD A REVIEW
      </h3>

      <p className="text-sm text-zinc-500">
        Your email address will not be published. Required fields are marked *
      </p>

      <p className="text-sm text-zinc-500">Your rating *</p>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            ref={ratingButtonRef}
            key={`${i}-star`}
            onClick={() => setYourRating(i + 1)}
            onMouseEnter={() => setHoveredRating(i + 1)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            <img
              key={i}
              src={
                YourRating >= i + 1 || hoveredRating >= i + 1
                  ? lightstar
                  : dimmedStar
              }
              alt="star"
              className="w-6 h-6"
            />
          </button>
        ))}
      </div>

      <TextArea placeholder="Write your review here *" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField placeholder="Write your name here *" />
        <InputField placeholder="Write your email here *" type="email" />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-500">
        <input type="checkbox" />
        Save my name, email, and website in this browser for the next time.
      </label>

      <Button className="w-30 tracking-widest">SUBMIT</Button>
    </div>
  );
}
