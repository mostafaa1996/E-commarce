import { Clock, CreditCard, Package, ReceiptText, Truck } from "lucide-react";

function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

function displayValue(value, fallback = "Not available") {
  if (!hasValue(value)) {
    return fallback;
  }

  return typeof value === "number" ? value.toLocaleString() : value;
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatLabel(value) {
  if (!value) {
    return "Unknown";
  }

  return String(value).replaceAll("_", " ");
}

function getItemTitle(item) {
  return item?.title || item?.name || item?.product?.title || "Order item";
}

function getItemImage(item) {
  return item?.image || item?.product?.image || item?.product?.imageCover;
}

function getItemTotal(item) {
  return item?.subtotal || item?.totalPrice || item?.total || null;
}

function StatusPill({ status, statusColor }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${
        statusColor || "bg-zinc-100 text-zinc-600"
      }`}
    >
      <span className="truncate">{formatLabel(status)}</span>
    </span>
  );
}

function ItemAvatar({ item }) {
  const title = getItemTitle(item);
  const image = getItemImage(item);

  if (image) {
    return (
      <img
        src={image}
        alt={title}
        className="h-12 w-12 rounded-md border border-zinc-200 object-cover"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-500">
      {title.charAt(0).toUpperCase()}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  if (!hasValue(value)) {
    return null;
  }

  const IconComponent = icon;

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md bg-zinc-50 px-3 py-2">
      <IconComponent
        className="h-4 w-4 shrink-0 text-zinc-400"
        strokeWidth={1.8}
      />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase text-zinc-400">
          {label}
        </p>
        <p className="truncate text-sm text-[#272727]">{value}</p>
      </div>
    </div>
  );
}

function PriceLine({ label, value, strong = false }) {
  if (!hasValue(value)) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span
        className={
          strong ? "font-semibold text-[#272727]" : "font-medium text-zinc-700"
        }
      >
        {displayValue(value)}
      </span>
    </div>
  );
}

function OrderItem({
  items = [],
  orderId,
  status,
  statusColor,
  createdAt,
  updatedAt,
  totalPrice,
  itemsPrice,
  taxPrice,
  shippingPrice,
  paymentMethod,
  paymentStatus,
  paymentStatusColor,
}) {
  const visibleItems = items.slice(0, 3);
  const hiddenItemsCount = Math.max(items.length - visibleItems.length, 0);

  return (
    <article className="border-b border-zinc-200 bg-white px-4 py-5 transition hover:bg-zinc-50 last:border-b-0 sm:px-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                Order
              </span>
              <h3 className="max-w-full truncate text-sm font-semibold text-[#272727] sm:text-base">
                #{displayValue(orderId, "Unknown")}
              </h3>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {formatDate(createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusPill status={status} statusColor={statusColor} />
            {paymentStatus && (
              <StatusPill
                status={paymentStatus}
                statusColor={paymentStatusColor}
              />
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
          <div className="min-w-0 space-y-3">
            {visibleItems.length > 0 ? (
              visibleItems.map((item, index) => {
                const title = getItemTitle(item);
                const itemTotal = getItemTotal(item);

                return (
                  <div
                    key={item?._id || item?.id || `${title}-${index}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <ItemAvatar item={item} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#272727]">
                        {title}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        Qty: {displayValue(item?.quantity, 1)}
                        {hasValue(item?.price)
                          ? ` x ${displayValue(item.price)}`
                          : ""}
                      </p>
                    </div>
                    {hasValue(itemTotal) && (
                      <p className="shrink-0 text-sm font-semibold text-[#272727]">
                        {displayValue(itemTotal)}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-3 rounded-md bg-zinc-50 px-3 py-4 text-sm text-zinc-500">
                <Package className="h-4 w-4" strokeWidth={1.8} />
                No items found for this order
              </div>
            )}

            {hiddenItemsCount > 0 && (
              <p className="text-sm font-medium text-[#FF6543]">
                +{hiddenItemsCount} more item
                {hiddenItemsCount > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
            <PriceLine label="Items" value={itemsPrice} />
            <PriceLine label="Shipping" value={shippingPrice} />
            <PriceLine label="Tax" value={taxPrice} />
            <div className="border-t border-zinc-200 pt-3">
              <PriceLine label="Total" value={totalPrice} strong />
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <DetailItem
            icon={Clock}
            label="Last update"
            value={updatedAt ? formatDate(updatedAt) : ""}
          />
          <DetailItem
            icon={CreditCard}
            label="Payment method"
            value={paymentMethod ? formatLabel(paymentMethod) : ""}
          />
          <DetailItem
            icon={ReceiptText}
            label="Payment status"
            value={paymentStatus ? formatLabel(paymentStatus) : ""}
          />
          <DetailItem
            icon={Truck}
            label="Delivery status"
            value={status ? formatLabel(status) : ""}
          />
        </div>
      </div>
    </article>
  );
}

export default OrderItem;
