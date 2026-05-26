import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Card from "./Card";
import CardBody from "./CardBody";
import CardMedia from "./CardMedia";

const variantAliases = {
  ShowNameOnly: "compact",
  ShowTitleAndDescription: "description",
  ShowNameAndPrice: "default",
  ShowWishlistStyle: "wishlist",
};

function normalizeVariant(variant) {
  return variantAliases[variant] || variant || "default";
}

function normalizeProductCardProps(props) {
  return {
    ...props,
    title: props.title || props.name || props.Name || props.Title,
    description: props.description || props.Description,
    link: props.link || props.Link,
  };
}

export default function ProductCard({
  NavigationLink,
  variant = "default",
  className,
  mediaClassName,
  bodyClassName,
  badge,
  ...props
}) {
  const normalizedVariant = normalizeVariant(variant);
  const normalizedProps = normalizeProductCardProps(props);

  return (
    <Card
      className={twMerge(
        clsx(
          "group relative flex h-[360px] w-full max-w-[300px] flex-col items-center justify-center",
          "sm:h-[400px]",
          className,
        ),
      )}
    >
      <CardMedia
        Image={normalizedProps.image}
        alt={normalizedProps.title}
        badge={badge}
        NavigationLink={NavigationLink}
        className={mediaClassName}
      />
      <CardBody
        {...normalizedProps}
        variant={normalizedVariant}
        className={bodyClassName}
      />
    </Card>
  );
}
