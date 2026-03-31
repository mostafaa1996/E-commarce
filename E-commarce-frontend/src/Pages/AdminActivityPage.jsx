import { Package, ShoppingCart, TicketPercent, LogIn, UserPlus, Edit, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { cn } from "@/utils/utils";

const activities = [
  { action: "Product created", detail: "Added 'Wireless Earbuds X3' to catalog", user: "Admin", time: "2 minutes ago", icon: Package, color: "bg-success/10 text-success" },
  { action: "Order status changed", detail: "Order #ORD-2024-006 marked as Shipped", user: "Admin", time: "15 minutes ago", icon: ShoppingCart, color: "bg-info/10 text-info" },
  { action: "Coupon created", detail: "Created coupon 'VIP50' — 50% off", user: "Admin", time: "1 hour ago", icon: TicketPercent, color: "bg-primary/10 text-primary" },
  { action: "Product updated", detail: "Updated stock for 'Smart Watch Pro' (5 → 50)", user: "Admin", time: "2 hours ago", icon: Edit, color: "bg-warning/10 text-warning" },
  { action: "Admin login", detail: "Logged in from 192.168.1.1", user: "Admin", time: "3 hours ago", icon: LogIn, color: "bg-muted text-muted-foreground" },
  { action: "Customer registered", detail: "New customer: Karim Ahmed (karim@mail.com)", user: "System", time: "5 hours ago", icon: UserPlus, color: "bg-success/10 text-success" },
  { action: "Product deleted", detail: "Removed 'Old Webcam HD' from catalog", user: "Admin", time: "1 day ago", icon: Trash2, color: "bg-destructive/10 text-destructive" },
  { action: "Order status changed", detail: "Order #ORD-2024-004 marked as Delivered", user: "Admin", time: "1 day ago", icon: ShoppingCart, color: "bg-info/10 text-info" },
];

export default function AdminActivityPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Activity Log"
        description="Track all admin actions and system events"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Activity Log" }]}
      />

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[29px] top-0 bottom-0 w-px bg-border" />

          {activities.map((activity, i) => (
            <div key={i} className="relative flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 z-10", activity.color)}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{activity.detail}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">by {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}