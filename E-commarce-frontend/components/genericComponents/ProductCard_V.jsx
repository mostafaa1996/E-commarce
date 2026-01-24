import Card from "./Card";
import CardBody from "./CardBody";
import CardMedia from "./CardMedia";

export default function ProductCard({ image, title, price, NavigationLink }) {
  return (
    <Card
      NavigationLink={NavigationLink}
      className="w-[272.5px] h-[393px] flex flex-col justify-center"
    >
      <CardMedia Image={image} />
      <CardBody variant="ShowNameAndPrice" Name={title} Price={price} />
    </Card>
  );
}
