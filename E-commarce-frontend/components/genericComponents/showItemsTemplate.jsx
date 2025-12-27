import clsx from "clsx";
import ArrowForNext from "./arrowForNext";

export default function ShowItemsTemplate({ className = "", children }) {
  const customClassName = className;
  const defaultClassName = `xl:h-[678px] lg:h-[600px] md:h-[500px] sm:h-[400px] h-[300px] bg-[#F5F5F5] `;
  return (
    <div
      className={clsx(
        customClassName ? customClassName : defaultClassName,
        "flex flex-col sm:flex-row items-center justify-evenly"
      )}
    >
      {/* TODO: Add action */}
      <ArrowForNext className="sm:my-0 my-1" direction="left"></ArrowForNext>
      <div className="flex flex-row item-center justify-center sm:gap-5 h-full ">
        {children}
      </div>
      {/* TODO: Add action */}
      <ArrowForNext className="sm:my-0 my-1" direction="right"></ArrowForNext>
    </div>
  );
}
