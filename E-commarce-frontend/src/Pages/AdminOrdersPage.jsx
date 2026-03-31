import { Search, Eye, MoreHorizontal, Filter } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import  InputField  from "@/components/genericComponents/InputField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/adminUI/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/adminUI/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/adminUI/avatar";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/adminUI/dialog";
import { Separator } from "@/components/adminUI/separator";

const orders = [
  { id: "#ORD-2024-001", customer: "Ahmed Hassan", email: "ahmed@mail.com", date: "Mar 16, 2026", total: "$96.79", payment: "Paid", delivery: "Shipped", status: "Processing" },
  { id: "#ORD-2024-002", customer: "Sara Ali", email: "sara@mail.com", date: "Mar 15, 2026", total: "$142.50", payment: "Paid", delivery: "Delivered", status: "Completed" },
  { id: "#ORD-2024-003", customer: "Mohamed Nour", email: "mohamed@mail.com", date: "Mar 15, 2026", total: "$67.99", payment: "Pending", delivery: "Pending", status: "Pending" },
  { id: "#ORD-2024-004", customer: "Fatma Ibrahim", email: "fatma@mail.com", date: "Mar 14, 2026", total: "$234.00", payment: "Paid", delivery: "Delivered", status: "Completed" },
  { id: "#ORD-2024-005", customer: "Omar Khaled", email: "omar@mail.com", date: "Mar 14, 2026", total: "$89.99", payment: "Failed", delivery: "Cancelled", status: "Cancelled" },
  { id: "#ORD-2024-006", customer: "Laila Youssef", email: "laila@mail.com", date: "Mar 13, 2026", total: "$312.00", payment: "Paid", delivery: "Shipped", status: "Processing" },
  { id: "#ORD-2024-007", customer: "Hassan Mostafa", email: "hassan@mail.com", date: "Mar 12, 2026", total: "$45.50", payment: "Paid", delivery: "Delivered", status: "Completed" },
];

const statusMap = {
  Paid: "success", Pending: "warning", Failed: "danger",
  Delivered: "success", Shipped: "info", Cancelled: "danger",
  Completed: "success", Processing: "info",
};

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const columns = [
    { key: "id", header: "Order ID", render: (item) => <span className="font-medium text-primary cursor-pointer" onClick={() => setSelectedOrder(item)}>{item.id}</span> },
    {
      key: "customer", header: "Customer",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-secondary">{item.customer.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
          <div><p className="font-medium text-foreground text-sm">{item.customer}</p><p className="text-xs text-muted-foreground">{item.email}</p></div>
        </div>
      ),
    },
    { key: "date", header: "Date" },
    { key: "total", header: "Total", render: (item) => <span className="font-semibold">{item.total}</span> },
    { key: "payment", header: "Payment", render: (item) => <StatusBadge status={statusMap[item.payment]}>{item.payment}</StatusBadge> },
    { key: "delivery", header: "Delivery", render: (item) => <StatusBadge status={statusMap[item.delivery]}>{item.delivery}</StatusBadge> },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={statusMap[item.status]}>{item.status}</StatusBadge> },
    {
      key: "actions", header: "",
      render: (item) => (
        <AdminButton variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(item)}>
          <Eye className="h-4 w-4" />
        </AdminButton>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Orders"
        description="Manage and track customer orders"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Orders" }]}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <InputField placeholder="Search orders..." className="pl-9" />
        </div>
        <Select><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent>
        </Select>
        <Select><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="processing">Processing</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={orders} page={1} totalPages={5} />

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>{selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium text-sm">{selectedOrder.customer}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium text-sm">{selectedOrder.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium text-sm">{selectedOrder.date}</p></div>
                <div><p className="text-xs text-muted-foreground">Total</p><p className="font-semibold text-sm">{selectedOrder.total}</p></div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Status</p>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={statusMap[selectedOrder.payment]}>Payment: {selectedOrder.payment}</StatusBadge>
                  <StatusBadge status={statusMap[selectedOrder.delivery]}>Delivery: {selectedOrder.delivery}</StatusBadge>
                  <StatusBadge status={statusMap[selectedOrder.status]}>Order: {selectedOrder.status}</StatusBadge>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Items</p>
                <div className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📱</span>
                    <div><p className="text-sm font-medium">ECOPAD 10.1" Tablet</p><p className="text-xs text-muted-foreground">Qty: 1 × $79.99</p></div>
                  </div>
                  <p className="font-semibold text-sm">$79.99</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Shipping Address</p>
                <p className="text-sm text-muted-foreground">19,15 Al Zohour, Alexandria, Egypt</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Update Status</p>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Change status..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}