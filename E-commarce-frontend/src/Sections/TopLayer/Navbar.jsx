import { Link } from "react-router-dom";
import clsx from "clsx";
import arrowDown from "/arrow-down.svg";
import userProfile from "/user-profile.svg";
import cart from "/cart.svg";
import wishlist from "/wishlist-heart.svg";
import logout from "/logout.jpg";
import { useCartStore } from "../../zustand_Cart/CartStore";

export default function Navbar() {
  const cartStore = useCartStore();
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
        <Link to="/shop" className="hover:text-[#FF6543]">
          SHOP
        </Link>
        <Link to="/login" className="hover:text-[#FF6543]">
          BLOGS
        </Link>
        <div className="flex flex-row items-center justify-center">
          <Link to="/register" className="hover:text-[#FF6543]">
            PAGES
          </Link>
          <img
            className="hover:scale-120 cursor-pointer"
            src={arrowDown}
            alt="arrow"
          />
        </div>
        <Link to="/cart" className="hover:text-[#FF6543]">
          CONTACT
        </Link>
      </div>

      <div className="flex flex-row items-center justify-center gap-3 lg:w-1/3 w-1/4">
        <Link
          to="/logout"
          className={`w-[30px] aspect-square cursor-pointer
           hover:scale-110 transition duration-200 ease-in-out
          `}
        >
          <img src={logout} alt="logout" />
        </Link>
        <Link
          to="/userProfile"
          className={`w-[30px] aspect-square cursor-pointer
           hover:scale-110 transition duration-200 ease-in-out
          `}
        >
          <img src={userProfile} alt="userProfile" />
        </Link>
        <Link
          to="/wishlist"
          className={`w-[30px] aspect-square cursor-pointer
           hover:scale-110 transition duration-200 ease-in-out
          `}
        >
          <img src={wishlist} alt="wishlist" />
        </Link>
        <Link
          to="/cart"
          className={`relative w-[30px] aspect-square cursor-pointer
           hover:scale-110 transition duration-200 ease-in-out
          `}
        >
          <img src={cart} alt="cart" />
          <div>
            <p className="absolute top-0 right-0 text-[10px] bg-[#FF6543] text-white px-1 rounded-full">
              {cartStore.totalItems || 0}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
