import Button from "@/components/genericComponents/Button";
import HeartOutline from "/heart-outline.svg";

export default function ProductActions({
  OrderHandler,
  AddToCartHandler,
  AddToWishlistHandler,
  AddedToWishlistBefore,
  ADDButtonText = "ADD TO CART",
}) {
  
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          OrderHandler();
        }}
      >
        ORDER NOW
      </Button>

      <Button
        onClick={() => {
          AddToCartHandler();
        }}
        variant="secondary"
      >
        {ADDButtonText}
      </Button>

      <button
        onClick={() => {
          AddToWishlistHandler();
        }}
        className={`w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer
        ${AddedToWishlistBefore ? "bg-red-500 border-red-500" : "bg-black"}`}
      >
        <img src={HeartOutline} alt="Heart" />
      </button>
    </div>
  );
}
