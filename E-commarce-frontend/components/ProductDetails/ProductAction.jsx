import Button from "../genericComponents/Button";
import HeartOutline from "/heart-outline.svg";

export default function ProductActions({OrderHandler , AddToCartHandler , AddToWishlistHandler}) {
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => {OrderHandler()}}>ORDER NOW</Button>

      <Button onClick={() => {AddToCartHandler()}} variant="secondary">
        ADD TO CART
      </Button>

      <button
        onClick={() => {AddToWishlistHandler()}}
        className="w-10 h-10 border rounded-full flex items-center justify-center bg-black"
      >
        <img src={HeartOutline} alt="Heart" />
      </button>
    </div>
  );
}
