// Footer.jsx
import facebook from "/facebookLogo.svg";
import instagram from "/InstagramLogo.svg";
import twitter from "/Xlogo.svg";
import youtube from "/YoutubeLogo.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white text-[11px] tracking-[0.18em] text-gray-500">
      <div className="mx-auto flex justify-evenly gap-10 py-10">
        <div className="max-w-xs space-y-4">
          <h2 className="text-[31px] uppercase">
            <span className="font-semibold text-[#272727]">SHOP</span>
            <span className="font-light text-[#272727]">LITE</span>
          </h2>
          <p className="text-[21px] text-[#272727] font-extralight">
            Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit.
            Gravida massa volutpat aenean odio erat nullam fringilla.
          </p>
          <div className="flex items-center gap-3">
            <button className="w-[9px] aspect-square cursor-pointer">
                <img src={facebook} alt="facebook" />
            </button>
            <button className="w-[9px] aspect-square cursor-pointer">
                <img src={instagram} alt="instagram" />
            </button>
            <button className="w-[9px] aspect-square cursor-pointer">
                <img src={twitter} alt="twitter" />
            </button>
            <button className="w-[9px] aspect-square cursor-pointer">
                <img src={youtube} alt="youtube" />
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4 max-w-xs">
          <h3 className="text-[22px] font-Extralight uppercase text-[#272727] whitespace-nowrap">
            Quick links
          </h3>
          <ul className="space-y-2">
            {["Home", "About", "Shop", "Blogs", "Contact"].map((item) => (
              <li key={item} className="uppercase text-[#272727] text-[16px] font-light hover:text-gray-600">
                <Link to={`/${item.toLowerCase()}`}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help & info */}
        <div className="space-y-4 max-w-xs">
          <h3 className="text-[22px] font-Extralight uppercase text-[#272727] whitespace-nowrap">
            Help & info
          </h3>
          <ul className="space-y-1">
            {[
              "Track your order",
              "Returns policies",
              "Shipping + delivery",
              "Contact us",
              "FAQs",
            ].map((item) => (
              <li key={item} className="uppercase text-[#272727] text-[16px] font-light hover:text-gray-600">
                <Link to={`/${item.toLowerCase()}`}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4 max-w-xs">
          <h3 className="text-[22px] font-Extralight uppercase text-[#272727]">
            Contact us
          </h3>
          <p className="uppercase text-[#272727] text-[21px] font-extralight">
            Do you have any queries or suggestions?
            <br />
            <span className="cursor-pointer text-[#272727] underline">
              yourinfo@gmail.com
            </span>
          </p>
          <p className="uppercase text-[#272727] text-[21px] font-extralight">
            If you need support? Just give us a call.
            <br />
            <span className="cursor-pointer text-[#272727] underline">
              +55 111 222 333 44
            </span>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between py-4 text-[10px] text-gray-400">
          <div className="flex items-center gap-1">
            <span>We ship with:</span>
            <span className="h-3 w-10 bg-gray-100" />
            <span className="h-3 w-10 bg-gray-100" />
          </div>

          <div className="flex items-center gap-1">
            <span>Payment options:</span>
            <span className="h-3 w-6 bg-gray-100" />
            <span className="h-3 w-6 bg-gray-100" />
            <span className="h-3 w-6 bg-gray-100" />
          </div>

          <p className="text-center">
            © Copyright 2024 ShopLite.All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
