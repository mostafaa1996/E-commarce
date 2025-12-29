import ShowItemsTemplate from "../genericComponents/showItemsTemplate";
import AppleProduct from "/AppleProductImg.png";
import LimitedSaleCounter from "../genericComponents/LimitedSaleCounter";
import Button from "../genericComponents/Button";
export default function LimitedSale() {
  return (
    <ShowItemsTemplate>
      <div className="flex flex-row items-center justify-between md:gap-50 sm:gap-30 gap-10">
        <div className="lg:w-[676px] sm:w-[576px] w-[276px] lg:h-[504px] sm:h-[404px] h-[204px]">
          <img src={AppleProduct} alt="LimitedSale" />
        </div>
        <div className="flex flex-col items-start justify-center text-center">
          <h1 className="text-[#272727] md:text-[51px] sm:text-[31px] text-[12px] font-extralight text-start">
            30% DISCOUNT ON
          </h1>
          <h1 className="text-[#272727] md:text-[51px] sm:text-[31px] text-[12px] font-extralight text-start">
            APPLE COLLECTION
          </h1>
          <LimitedSaleCounter
            ObjectOfTime={{
              Days: 21,
              hrs: 22,
              Min: 19,
              Sec: 30,
            }}
          />
          <Button className="sm:mt-9 mt-5">SHOP COLLECTION</Button>
        </div>
      </div>
    </ShowItemsTemplate>
  );
}
