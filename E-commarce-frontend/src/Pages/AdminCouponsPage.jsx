import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/adminUI/dialog";
import  InputField  from "@/components/genericComponents/InputField";
import { Label } from "@/components/genericComponents/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/adminUI/select";
import { Switch } from "@/components/adminUI/switch";

const coupons = [
  { code: "SUMMER60", type: "Percentage", value: "60%", minOrder: "$50", expiry: "Aug 31, 2026", usage: "234/500", status: "Active" },
  { code: "WELCOME10", type: "Fixed", value: "$10", minOrder: "$30", expiry: "Dec 31, 2026", usage: "1,024/∞", status: "Active" },
  { code: "FLASH25", type: "Percentage", value: "25%", minOrder: "$100", expiry: "Mar 20, 2026", usage: "500/500", status: "Expired" },
  { code: "FREESHIP", type: "Free Shipping", value: "Free", minOrder: "$0", expiry: "Jun 30, 2026", usage: "89/200", status: "Active" },
  { code: "VIP50", type: "Percentage", value: "50%", minOrder: "$200", expiry: "Apr 15, 2026", usage: "12/50", status: "Active" },
];

export default function AdminCouponsPage() {
  const columns = [
    {
      key: "code", header: "Coupon Code",
      render: (item) => (
        <div className="flex items-center gap-2">
          <code className="bg-secondary px-2 py-1 rounded text-sm font-mono font-semibold text-foreground">{item.code}</code>
          <AdminButton variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></AdminButton>
        </div>
      ),
    },
    { key: "type", header: "Type" },
    { key: "value", header: "Value", render: (item) => <span className="font-semibold text-primary">{item.value}</span> },
    { key: "minOrder", header: "Min Order" },
    { key: "expiry", header: "Expires" },
    { key: "usage", header: "Usage" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status === "Active" ? "success" : "pending"}>{item.status}</StatusBadge> },
    {
      key: "actions", header: "",
      render: () => (
        <div className="flex gap-1">
          <AdminButton variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></AdminButton>
          <AdminButton variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></AdminButton>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Coupons & Discounts"
        description="Create and manage promotional coupons"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Coupons" }]}
        actions={
          <Dialog>
            <DialogTrigger asChild><AdminButton><Plus className="h-4 w-4 mr-2" />Create Coupon</AdminButton></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Coupon</DialogTitle><DialogDescription>Set up a new promotional coupon.</DialogDescription></DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2"><Label>Coupon Code</Label><InputField placeholder="e.g. SUMMER60" /></div>
                <div className="space-y-2"><Label>Discount Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed Amount</SelectItem><SelectItem value="shipping">Free Shipping</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Discount Value</Label><InputField type="number" placeholder="0" /></div>
                <div className="space-y-2"><Label>Minimum Order</Label><InputField type="number" placeholder="0.00" /></div>
                <div className="space-y-2"><Label>Expiration Date</Label><InputField type="date" /></div>
                <div className="space-y-2"><Label>Usage Limit</Label><InputField type="number" placeholder="Unlimited" /></div>
                <div className="col-span-2 flex items-center gap-2"><Switch id="coupon-active" defaultChecked /><Label htmlFor="coupon-active">Active</Label></div>
              </div>
              <DialogFooter><AdminButton variant="outline">Cancel</AdminButton><AdminButton>Create Coupon</AdminButton></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={coupons} />
    </AdminLayout>
  );
}
