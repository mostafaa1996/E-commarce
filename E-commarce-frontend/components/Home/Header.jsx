import CameraImg from "/CameraImg.png";
import Button from "../Button";
import ShowProductTemplate from "../showProductTemplate";
import clsx from "clsx";
export default function HomeHeader() {
  return (
    <ShowProductTemplate>
      <div className="h-full w-fit flex flex-col sm:items-end justify-center">
        <div className="flex flex-col sm:items-start justify-center ml-2">
          <h1 className="text-[#272727] md:text-[51px] text-[12px] font-extralight text-start">
            GOPRO HERO9 BLACK {/* TODO: Add real product name  */}
          </h1>
          <p className="text-[#272727] md:text-[21px] text-[10px] font-extralight">
            Limited stocks available. Grab it now!
          </p>
          <Button className="sm:mt-9 mt-5">SHOP COLLECTION</Button>
        </div>
      </div>
      <div className={clsx(
        "relative xl:w-[800px] lg:w-[700px] md:w-[600px] sm:w-[500px] w-[250px] overflow-hidden ",
        "2xl:right-[-8%] lg:right-[2%] md:right-[3%] right-0")}>
        <div className="absolute w-full aspect-square rounded-full bg-[#EEEEEE] xl:top-[-61px] lg:top-[-51px] top-[-20px]">
          {/* TODO: Add real product photo  */}
          <img
            className="w-full h-full object-cover"
            src={CameraImg}
            alt="Camera"
          />
        </div>
      </div>
    </ShowProductTemplate>
  );
}
