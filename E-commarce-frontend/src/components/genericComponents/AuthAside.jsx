import clsx from "clsx"

export default function AuthAside() {
  return (
    <div
      className={clsx(
        "bg-[#FF6543] text-white flex h-screen",
        "flex-col justify-between p-10 lg:p-16" 
      )}
    >
      <div className="max-w-l">
        <h2 className="text-[30px] font-extralight leading-snug">
          Looking for 
          <br />
          high-quality electronic products?
        </h2>

        <p className="mt-4 text-[21px] font-light">
          <span className="text-blue-600 underline">ShopLite</span> will help you.
        </p>
      </div>

      {/* Brand mark */}
      <div className="flex flex-col items-start gap-10">
        <div className="w-50 h-28 bg-white rounded-r-full flex items-center justify-center">
          <span className="text-[#FF6543] text-4xl font-bold">ShopLite</span>
        </div>

        <span className="text-xs opacity-80">
          www.ShopLite.com
        </span>
      </div>
    </div>
  );
}
