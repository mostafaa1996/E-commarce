import Icon from "@/system/icons/Icon";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const variantAliases = {
  ShowNameOnly: "compact",
  ShowTitleAndDescription: "description",
  ShowNameAndPrice: "default",
  ShowWishlistStyle: "wishlist",
};

function normalizeVariant(variant) {
  return variantAliases[variant] || variant || "default";
}

function CardBodyContainer({ children, className }) {
  return (
    <div className={twMerge(clsx("flex w-full flex-col gap-2 p-5", className))}>
      {children}
    </div>
  );
}

function ProductSummaryBody({ title, price, className }) {
  return (
    <CardBodyContainer className={clsx("items-center", className)}>
      <CardTitle>{title}</CardTitle>
      <CardPrice price={price} />
    </CardBodyContainer>
  );
}

function CompactBody({ title, className }) {
  return (
    <CardBodyContainer className={className}>
      <CardTitle>{title}</CardTitle>
    </CardBodyContainer>
  );
}

function DescriptionBody({ title, description, link, className }) {
  return (
    <CardBodyContainer className={className}>
      <CardTitle align="left">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      {link && <CardLink>{link}</CardLink>}
    </CardBodyContainer>
  );
}

function WishlistBody({
  category,
  title,
  price,
  oldPrice,
  onAdd,
  addButtonText = "Add to Cart",
  isAddDisabled = false,
  onRemove,
  className,
}) {
  return (
    <CardBodyContainer className={clsx("items-start", className)}>
      {category && <p className="text-sm text-zinc-500">{category}</p>}
      <CardTitle align="left">{title}</CardTitle>
      <CardPrice price={price} oldPrice={oldPrice} />

      {onAdd && (
        <button
          type="button"
          className={twMerge(
            clsx(
              "mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FF6543] p-2 transition active:scale-95",
              isAddDisabled
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:scale-[1.02]",
            ),
          )}
          disabled={isAddDisabled}
          onClick={onAdd}
        >
          <Icon name="cart" variant="surrounded" size={22} />
          <span className="text-center text-sm font-medium text-white">
            {addButtonText}
          </span>
        </button>
      )}

      {onRemove && (
        <button
          type="button"
          className="absolute right-2 top-2 hidden cursor-pointer rounded-full bg-[#FF6543] p-2 transition hover:scale-105 active:scale-95 group-hover:block"
          onClick={onRemove}
          aria-label="Remove from wishlist"
        >
          <Icon name="trash" variant="surrounded" size={20} />
        </button>
      )}
    </CardBodyContainer>
  );
}

const bodyVariants = {
  default: ProductSummaryBody,
  compact: CompactBody,
  description: DescriptionBody,
  wishlist: WishlistBody,
};

export default function CardBody({ variant = "default", ...props }) {
  const Body = bodyVariants[normalizeVariant(variant)] || ProductSummaryBody;

  return <Body {...props} />;
}

const CardTitle = ({ children, align = "center" }) => (
  <h3
    className={twMerge(
      clsx(
        "line-clamp-1 text-[21px] font-light text-[#272727]",
        align === "center" ? "text-center" : "text-left",
      ),
    )}
  >
    {children}
  </h3>
);

const CardDescription = ({ children }) => (
  <p className="line-clamp-3 text-sm text-zinc-500">{children}</p>
);

const CardPrice = ({ price, oldPrice }) => {
  if (!price && !oldPrice) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {oldPrice && (
        <span className="text-sm text-zinc-400 line-through">{oldPrice}</span>
      )}
      {price && <span className="text-[18px] font-light text-[#FF6543]">{price}</span>}
    </div>
  );
};

const CardLink = ({ children }) => (
  <span className="cursor-pointer text-sm underline">{children}</span>
);
