import Card from "./Card";
import CardBody from "./CardBody";
import CardMedia from "./CardMedia";

export default function ProductCard({ NavigationLink , variant , ...props}) {
  return (
    <Card
      className="w-[272.5px] h-[393px] flex flex-col justify-center relative group"
    >
      <CardMedia Image={props.image} NavigationLink={NavigationLink} />
      <CardBody variant={variant || "ShowNameAndPrice"} {...props} />
    </Card>
  );
}
