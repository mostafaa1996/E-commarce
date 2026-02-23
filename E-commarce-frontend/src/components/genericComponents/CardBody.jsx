const variants = {
    ShowNameOnly : function(props) {
        return (
            <div className="p-5 flex flex-col gap-2">
                <CardTitle>{props.Name}</CardTitle>
            </div>
        );
    },
    ShowTitleAndDescription : function(props) {
        return (
            <div className="p-5 flex flex-col gap-2">
                <CardTitle>{props.Title}</CardTitle>
                <CardDescription>{props.Description}</CardDescription>
                <CardLink>{props.Link}</CardLink>
            </div>
        );
    },
    ShowNameAndPrice : function(props) {
        return (
            <div className="p-5 flex flex-col gap-2">
                <CardTitle>{props.Name}</CardTitle>
                <CardPrice>{props.Price}</CardPrice>
            </div>
        );
    },
};
export default function CardBody({ variant = "ShowNameOnly", ...props }) {
  return (
    <>{variants[variant](props)}</>
  );
}

const CardTitle = ({ children }) => (
  <h3 className="text-[21px] font-light text-[#272727] text-center line-clamp-1">
    {children}
  </h3>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-zinc-500 line-clamp-3">
    {children}
  </p>
);

const CardPrice = ({ children }) => (
  <span className="text-[#FF6543] font-light text-center">
    {children}
  </span>
);

const CardLink = ({ children }) => (
  <span className="text-sm underline cursor-pointer">
    {children}
  </span>
);