import Card from "./Card";
import CardBody from "./CardBody";
import CardMedia from "./CardMedia";

export default function ProductCard({ NavigationLink , variant , ...props}) {
  return (
    <Card className="relative flex h-[360px] w-full max-w-[300px] flex-col items-center justify-center group sm:h-[400px]">
      <CardMedia Image={props.image} NavigationLink={NavigationLink} />
      <CardBody variant={variant || "ShowNameAndPrice"} {...props} />
    </Card>
  );
}
