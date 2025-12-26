export default function LimitedSaleCounter({ ObjectOfTime }) {
  return (
    <div className="flex flex-row items-center justify-center text-center gap-2">
      {Object.entries(ObjectOfTime).map(([key, value], index, array) => (
        <div key={`time-${index+2}`} className="flex flex-row items-center justify-center text-center">
          <div key={`time-${index}`} className="flex flex-col items-center justify-center" gap-0>
            <p
              key={`time-${key}`}
              className="text-[#272727] md:text-[51px] sm:text-[31px] text-[12px] font-regular"
            >
              {value}
            </p>
            <p
              key={`time-${value}`}
              className="text-[#272727] md:text-[21px] sm:text-[18px] text-[8px] font-extralight text-start"
            >
              {key}
            </p>
          </div>
          {index < array.length - 1 && (
            <p
              key={`time-${index + 1}`}
              className="text-[#FF6543] md:text-[51px] sm:text-[31px] text-[12px] font-extralight text-start"
            >
             :
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
