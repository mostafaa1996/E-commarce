import Icon from "@/system/icons/Icon";
const variants = {
  ShowNameOnly: function (props) {
    return (
      <div className="p-5 flex flex-col gap-2">
        <CardTitle>{props.Name}</CardTitle>
      </div>
    );
  },
  ShowTitleAndDescription: function (props) {
    return (
      <div className="p-5 flex flex-col gap-2">
        <CardTitle>{props.Title}</CardTitle>
        <CardDescription>{props.Description}</CardDescription>
        <CardLink>{props.Link}</CardLink>
      </div>
    );
  },
  ShowNameAndPrice: function (props) {
    return (
      <div className="p-5 flex flex-col items-center gap-2">
        <CardTitle>{props.title}</CardTitle>
        <CardPrice price={props.price} />
      </div>
    );
  },
  ShowWishlistStyle: function (props) {
    return (
      <div className="p-5 flex flex-col items-start gap-2">
        <p className="text-sm text-zinc-500">{props.category || ""}</p>
        <CardTitle>{props.title}</CardTitle>
        <CardPrice price={props.price} oldPrice={props.oldPrice || ""} />
        <button
          className="w-[95%] self-center rounded-xl flex items-center justify-center gap-3 bg-[#FF6543] p-2 cursor-pointer hover:scale-105"
          onClick={props.onAdd}
        >
          <Icon name="cart" variant="surrounded" size={24} />
          <p className="text-white text-center">Add to Cart</p>
        </button>
        <button
          className="hidden absolute top-2 right-2 cursor-pointer group-hover:block bg-[#FF6543] rounded-full p-2"
          onClick={props.onRemove}
        >
          <Icon name="trash" variant="surrounded" size={24} />
        </button>
      </div>
    );
  },
};
export default function CardBody({ variant = "ShowNameOnly", ...props }) {
  return <>{variants[variant](props)}</>;
}

const CardTitle = ({ children }) => (
  <h3 className="text-[21px] font-light text-[#272727] text-center line-clamp-1">
    {children}
  </h3>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-zinc-500 line-clamp-3">{children}</p>
);

const CardPrice = ({ price, oldPrice }) => (
  <div className="flex items-center gap-2">
    {oldPrice && (
      <span className="text-sm text-zinc-400 line-through">{oldPrice}</span>
    )}
    <span className="text-[#FF6543] font-light text-[18px]">{price}</span>
  </div>
);

const CardLink = ({ children }) => (
  <span className="text-sm underline cursor-pointer">{children}</span>
);
