import Button from "../genericComponents/Button";
import HeartOutline from "/heart-outline.svg";
export default function ProductActions() {
  return (
    <div className="flex items-center gap-4">
      <Button>ORDER NOW</Button>

      <Button variant="secondary">ADD TO CART</Button>

      <button className="w-10 h-10 border rounded-full flex items-center justify-center bg-black">
        <img src={HeartOutline} alt="Heart" />
      </button>
    </div>
  );
}
