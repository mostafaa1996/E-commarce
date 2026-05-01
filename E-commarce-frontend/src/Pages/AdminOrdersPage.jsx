import Icon from "@/system/icons/Icon";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import InputField from "@/components/genericComponents/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";
import { Avatar, AvatarFallback } from "@/components/adminUI/avatar";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/adminUI/dialog";
import { Separator } from "@/components/adminUI/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAdminOrders, updateAdminOrder } from "@/APIs/adminOrdersService";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/genericComponents/Loading";
import { AlertCircle } from "lucide-react";
import useURLQuery from "@/hooks/UrlQuery";
import { shortenText } from "@/utils/utils";

const statusMap = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  delivered: "success",
  shipped: "info",
  cancelled: "danger",
  completed: "success",
  processing: "info",
  orderPlaced: "info",
  refunded: "danger",
  returned: "danger",
  not_required: "success",
};

const defaultQuery = {
  status: "all",
  paymentStatus: "all",
  search: "",
  page: 1,
  limit: 10,
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.paymentStatus !== defaultQuery.paymentStatus ||
    query.search !== defaultQuery.search
  );
}

export default function AdminOrdersPage() {
  let content = null;
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);

  const {
    data: ordersData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["AdminOrders", MainQuery],
    queryFn: () => getAdminOrders(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: (order) => updateAdminOrder(order.id, order),
    onMutate: (order) => {
      const previousOrder = orders.find((o) => o.id === order.id);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
      return { previousOrder };
    },
    onSuccess: () => {
      setSelectedOrder(null);
      toast({ title: "Order updated successfully" });
    },
    onError: (error, context) => {
      if (context?.previousOrder) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === context.previousOrder.id
              ? context.previousOrder
              : order,
          ),
        );
        toast({
          title: "Error updating order",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [searchInput]);

  useEffect(() => {
    updateUrlQuery({
      search: searchTerm,
      status: selectedStatus,
      paymentStatus: selectedPaymentStatus,
      limit: 10,
    });
  }, [selectedPaymentStatus, selectedStatus, searchTerm]);

  useEffect(() => {
    if (!ordersData) return;
    setOrders(ordersData.orders);
  }, [ordersData]);

  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (item) => (
        <span
          className="font-medium text-primary cursor-pointer"
          onClick={() => setSelectedOrder(item)}
        >
          {item.orderId}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px] bg-secondary">
              {item.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground text-sm">
              {item.customer}
            </p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <span className="font-medium text-foreground">{item.date}</span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (item) => (
        <span className="font-semibold">{item.totalPrice}</span>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      render: (item) => (
        <StatusBadge status={statusMap[item.paymentStatus]}>
          {item.paymentStatus}
        </StatusBadge>
      ),
    },
    {
      key: "PaymentMethod",
      header: "Payment Method",
      render: (item) => (
        <span className="font-medium text-foreground">
          {item.paymentMethod}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={statusMap[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item) => (
        <AdminButton
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setSelectedOrder(item);
          }}
        >
          <Icon name="eye" className="h-4 w-4" />
        </AdminButton>
      ),
    },
  ];

  if ((isLoading || isFetching) && !ordersData) {
    content = <Loading message="Loading orders" fullPage />;
  }

  if (error && !ordersData) {
    content = (
      <AdminLayout>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (ordersData) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Orders"
          description="Manage and track customer orders"
          breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Orders" }]}
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <InputField
              placeholder="Search orders..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {isQueryChangedFromDefault(MainQuery) && (
            <AdminButton
              onClick={() => {
                resetUrlQuery(defaultQuery);
                setSearchInput("");
                setSearchTerm("");
                setSelectedPaymentStatus("all");
                setSelectedStatus("all");
              }}
              variant="ghost"
              className="w-full sm:w-auto"
            >
              Clear Filters
            </AdminButton>
          )}
          <Select
            value={selectedPaymentStatus}
            onValueChange={setSelectedPaymentStatus}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {ordersData.paymentStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {ordersData.statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          page={ordersData.pagination?.page || 1}
          totalPages={ordersData.pagination?.totalPages || 1}
          onPageChange={(page) => updateUrlQuery({ page })}
        />

        {/* Order Details Dialog */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>{selectedOrder?.id}</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium text-sm">
                      {selectedOrder.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium text-sm">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold text-sm">
                      {selectedOrder.totalPrice}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <StatusBadge status={statusMap[selectedOrder.payment]}>
                      Payment: {selectedOrder.paymentStatus}
                    </StatusBadge>
                    <StatusBadge status={statusMap[selectedOrder.status]}>
                      Order: {selectedOrder.status}
                    </StatusBadge>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Items
                  </p>
                  {selectedOrder.orderItems.map((item) => (
                    <div className="border rounded-lg p-3 flex items-center justify-between my-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-10 w-10"
                          />
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {shortenText(item.title, 20)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} X {item.price}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm">{item.subtotal}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Shipping Address
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
                <Separator />
                {selectedOrder.status !== "Delivered" &&
                  selectedOrder.status !== "Cancelled" &&
                  selectedOrder.status !== "returned" &&
                  selectedOrder.status !== "failed" && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                        Update Status
                      </p>
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(value) =>
                          updateOrderStatus({ ...selectedOrder, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Change status..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ordersData.statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
