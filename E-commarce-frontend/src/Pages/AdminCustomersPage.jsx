import { Search, Eye, MoreHorizontal } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import  InputField  from "@/components/genericComponents/InputField";
import { Avatar, AvatarFallback } from "@/components/adminUI/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/adminUI/sheet";
import { Separator } from "@/components/adminUI/separator";
import { useState } from "react";

const customers = [
  { name: "Mostafa Hamdy", email: "mostafahamdy199617@...", phone: "01282202531", date: "Feb 24, 2026", orders: 4, spent: "$387.15", status: "Active", location: "Alexandria, Egypt" },
  { name: "Ahmed Hassan", email: "ahmed@mail.com", phone: "01012345678", date: "Jan 15, 2026", orders: 12, spent: "$1,234.50", status: "Active", location: "Cairo, Egypt" },
  { name: "Sara Ali", email: "sara@mail.com", phone: "01198765432", date: "Dec 10, 2025", orders: 8, spent: "$876.00", status: "Active", location: "Giza, Egypt" },
  { name: "Omar Khaled", email: "omar@mail.com", phone: "01055544433", date: "Mar 01, 2026", orders: 1, spent: "$89.99", status: "Inactive", location: "Luxor, Egypt" },
  { name: "Fatma Ibrahim", email: "fatma@mail.com", phone: "01234567890", date: "Nov 20, 2025", orders: 6, spent: "$542.00", status: "Active", location: "Mansoura, Egypt" },
  { name: "Laila Youssef", email: "laila@mail.com", phone: "01122334455", date: "Feb 14, 2026", orders: 3, spent: "$312.00", status: "Active", location: "Alexandria, Egypt" },
];

export default function AdminCustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const columns = [
    {
      key: "name", header: "Customer",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{item.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
          <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.email}</p></div>
        </div>
      ),
    },
    { key: "phone", header: "Phone" },
    { key: "date", header: "Joined" },
    { key: "orders", header: "Orders", render: (item) => <span className="font-semibold">{item.orders}</span> },
    { key: "spent", header: "Total Spent", render: (item) => <span className="font-semibold">{item.spent}</span> },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status === "Active" ? "success" : "pending"}>{item.status}</StatusBadge> },
    {
      key: "actions", header: "",
      render: (item) => (
        <AdminButton variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCustomer(item)}>
          <Eye className="h-4 w-4" />
        </AdminButton>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Customers"
        description="Manage your customer base"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Customers" }]}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <InputField placeholder="Search customers..." className="pl-9" />
        </div>
      </div>

      <DataTable columns={columns} data={customers} page={1} totalPages={3} />

      {/* Customer Detail Sheet */}
      <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Customer Details</SheetTitle>
            <SheetDescription>View customer information</SheetDescription>
          </SheetHeader>
          {selectedCustomer && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">{selectedCustomer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">Member since {selectedCustomer.date}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{selectedCustomer.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{selectedCustomer.phone}</p></div>
                <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium">{selectedCustomer.location}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={selectedCustomer.status === "Active" ? "success" : "pending"}>{selectedCustomer.status}</StatusBadge></div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary rounded-lg p-4 text-center"><p className="text-2xl font-bold text-foreground">{selectedCustomer.orders}</p><p className="text-xs text-muted-foreground">Total Orders</p></div>
                <div className="bg-secondary rounded-lg p-4 text-center"><p className="text-2xl font-bold text-foreground">{selectedCustomer.spent}</p><p className="text-xs text-muted-foreground">Total Spent</p></div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
