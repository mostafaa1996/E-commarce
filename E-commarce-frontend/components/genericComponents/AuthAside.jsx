import clsx from "clsx"

export default function AuthAside() {
  return (
    <div
      className={clsx(
        "bg-[#FF6543] text-white flex h-screen",
        "flex-col justify-between p-10 lg:p-16" 
      )}
    >
      <div className="max-w-sm">
        <h2 className="text-[30px] font-extralight leading-snug">
          Need webdesign
          <br />
          for your business?
        </h2>

        <p className="mt-4 text-[21px] font-light">
          <span className="text-blue-600 underline">Design Spacee</span> will help you.
        </p>
      </div>

      {/* Brand mark */}
      <div className="flex items-end justify-between">
        <div className="w-50 h-28 bg-white rounded-r-full flex items-center justify-center">
          <span className="text-[#FF6543] text-4xl font-bold">ShopLite</span>
        </div>

        <span className="text-xs opacity-80">
          ShopLite@designspacee.com
        </span>
      </div>
    </div>
  );
}
