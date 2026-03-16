import Icon from "@/system/icons/Icon";
import Button from "@/components/genericComponents/Button";
export default function OrderFeedBack({orderId, IconName, header ,  message, okHandler}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in-0 zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-full bg-[#E5E5E5] flex items-center justify-center">
        {IconName && typeof IconName === "string" && (
          <Icon
            name={IconName}
            size={24}
            className="w-10 h-10 text-accent-foreground"
          />
        )}
      </div>
      <h3 className="text-2xl font-bold text-foreground">{header}</h3>
      <p className="text-muted-foreground text-center max-w-sm">{message}</p>
      {orderId && (
        <p className="text-sm text-muted-foreground">Order #ORD-{orderId}</p>
      )}
      <Button
        type="button"
        className="w-fit tracking-widest"
        onClick={okHandler}
      >
        OK
      </Button>
    </div>
  );
}
