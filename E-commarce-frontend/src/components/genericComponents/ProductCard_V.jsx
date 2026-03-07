import Card from "./Card";
import CardBody from "./CardBody";
import CardMedia from "./CardMedia";

export default function ProductCard({ NavigationLink , variant , ...props}) {
  return (
    <Card
      className="w-[300px] h-[400px] flex flex-col justify-center items-center relative group"
    >
      <CardMedia Image={props.image} NavigationLink={NavigationLink} />
      <CardBody variant={variant || "ShowNameAndPrice"} {...props} />
    </Card>
  );
}
