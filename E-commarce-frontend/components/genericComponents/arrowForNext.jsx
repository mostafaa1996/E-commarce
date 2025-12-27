import arrowLeft from "/left_arrow.svg";
import arrowRight from "/right_arrow.svg";
import clsx from "clsx";
export default function ArrowForNext({ className = " ", direction }) {
  const customClassName = className;
  return (
    <div
      className={clsx(
        "cursor-pointer bg-[#F5F5F5] border-2 border-zinc-300",
        `hover:scale-105  rounded-xl   ${customClassName}`,
        "lg:w-[40px] lg:h-[40px] md:w-[35px] md:h-[35px] w-[25px] h-[25px]",
        "sm:w-[30px] sm:h-[30px]"
      )}
    >
      <img
        className="w-full h-full rounded-xl"
        src={direction == "right" ? arrowRight : arrowLeft}
        alt="arrow"
      />
    </div>
  );
}
