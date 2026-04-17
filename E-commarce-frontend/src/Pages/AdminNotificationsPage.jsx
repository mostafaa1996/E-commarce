import { ShoppingCart, Package, UserPlus, AlertTriangle, Bell, CheckCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { cn } from "@/utils/utils";

const notifications = [
  { type: "order", icon: ShoppingCart, title: "New order received", description: "Order #ORD-2024-008 from Nadia Saleh — $156.00", time: "2 minutes ago", read: false },
  { type: "stock", icon: AlertTriangle, title: "Low stock alert", description: "USB-C Hub Adapter is running low (3 units remaining)", time: "15 minutes ago", read: false },
  { type: "user", icon: UserPlus, title: "New user registration", description: "Karim Ahmed just created an account", time: "1 hour ago", read: false },
  { type: "order", icon: ShoppingCart, title: "New order received", description: "Order #ORD-2024-007 from Hassan Mostafa — $45.50", time: "3 hours ago", read: true },
  { type: "stock", icon: AlertTriangle, title: "Out of stock", description: "Mechanical Keyboard is now out of stock", time: "5 hours ago", read: true },
  { type: "order", icon: CheckCircle, title: "Order delivered", description: "Order #ORD-2024-004 was delivered successfully", time: "1 day ago", read: true },
  { type: "user", icon: UserPlus, title: "New user registration", description: "Laila Youssef just created an account", time: "2 days ago", read: true },
];

const typeColors = {
  order: "bg-info/10 text-info",
  stock: "bg-warning/10 text-warning",
  user: "bg-success/10 text-success",
};

export default function AdminNotificationsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        description="Stay updated with your store activity"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Notifications" }]}
        actions={<AdminButton variant="outline" size="sm">Mark all as read</AdminButton>}
      />

      <div className="bg-card rounded-xl border shadow-sm divide-y">
        {notifications.map((notif, i) => (
          <div key={i} className={cn("flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors", !notif.read && "bg-primary/[0.02]")}>
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", typeColors[notif.type])}>
              <notif.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-medium", !notif.read ? "text-foreground" : "text-muted-foreground")}>{notif.title}</p>
                {!notif.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{notif.description}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}