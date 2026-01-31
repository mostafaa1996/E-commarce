import { Link } from "react-router-dom";
import clsx from "clsx";
import arrowDown from "/arrow-down.svg";
import userProfile from "/user-profile.svg";
import cart from "/cart.svg";
import wishlist from "/wishlist-heart.svg";
import logout from "/logout.jpg";

export default function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between text-center">
      <p className="text-[#272727] lg:text-[31px] text-[15px] font-bold lg:w-1/3 w-1/4 text-center">
        SHOP<span className="font-extralight">LITE</span>
      </p>
      <div
        className={clsx(
          "text-[#272727] lg:text-[16px] font-extralight lg:w-1/3",
          "flex flex-row items-center justify-center text-center lg:gap-10",
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
          <img className="hover:scale-120 cursor-pointer" src={arrowDown} alt="arrow" />
        </div>
        <Link to="/cart" className="hover:text-[#FF6543]">
          CONTACT
        </Link>
      </div>

      <div className="flex flex-row items-center justify-center gap-3 lg:w-1/3 w-1/4">
        <button className="w-[30px] aspect-square cursor-pointer">
          <img src={logout} alt="logout" />
        </button>
        <button className="w-[25px] aspect-square cursor-pointer">
          <img src={userProfile} alt="userProfile" />
        </button>
        <button className="w-[25px] aspect-square cursor-pointer">
          <img src={wishlist} alt="wishlist" />
        </button>
        <button className="w-[25px] aspect-square cursor-pointer">
          <img src={cart} alt="cart" />
        </button>
      </div>
    </div>
  );
}
