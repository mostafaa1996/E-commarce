import { Link } from "react-router-dom";
import clsx from "clsx";
import arrowDown from "/arrow-down.svg";
export default function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between text-center">
      <p className="text-[#272727] md:text-[31px] text-[15px] font-bold md:w-1/3 w-1/4 text-center">
        SHOP<span className="font-extralight">LITE</span>
      </p>
      <div
        className={clsx(
          "text-[#272727] md:text-[16px] font-extralight md:w-1/3",
          "flex flex-row items-center justify-center text-center md:gap-10",
          "gap-1 text-[8px] w-1/2"
        )}
      >
        <Link to="/" className="hover:text-[#FF6543]">
          HOME
        </Link>
        <Link to="/about" className="hover:text-[#FF6543]">
          ABOUT
        </Link>
        <Link to="/contact" className="hover:text-[#FF6543]">
          SHOP
        </Link>
        <Link to="/login" className="hover:text-[#FF6543]">
          BLOGS
        </Link>
        <div className="flex flex-row items-center justify-center">
          <Link to="/register" className="hover:text-[#FF6543]">
            PAGES
          </Link>
          <img src={arrowDown} alt="arrow" />
        </div>
        <Link to="/cart" className="hover:text-[#FF6543]">
          CONTACT
        </Link>
      </div>

      <p className="text-[#272727] md:text-[31px] text-[15px] font-bold md:w-1/3 w-1/4 text-center">
        SHOP<span className="font-extralight">LITE</span>
      </p>
    </div>
  );
}
