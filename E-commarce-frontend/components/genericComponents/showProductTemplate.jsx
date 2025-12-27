import ArrowForNext from "./arrowForNext";

export default function ShowProductTemplate({ children }) {
  return (
    <div
      className={`
     flex sm:flex-row flex-col items-center justify-evenly
     xl:h-[678px] lg:h-[600px] md:h-[500px] sm:h-[400px] h-[300px] bg-[#F5F5F5] `}
    >
      {/* TODO: Add action */}
      <ArrowForNext className="sm:my-0 my-1" direction="left"></ArrowForNext>
      <div className="flex flex-row item-center justify-center sm:gap-5 h-full ">
        {children}
      </div>
      {/* TODO: Add action */}
      <ArrowForNext className="sm:my-0 my-1"  direction="right"></ArrowForNext>
    </div>
  );
}