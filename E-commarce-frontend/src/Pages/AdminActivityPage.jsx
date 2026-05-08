import {
  Package,
  ShoppingCart,
  TicketPercent,
  LogIn,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { cn } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { getAdminActivityLog } from "@/APIs/adminActivityLog";

const suitableIconsForTypes = [
  {
    type: "PRODUCT_CREATED",
    icon: Package,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    type: "PRODUCT_UPDATED",
    icon: Edit,
    color: "bg-amber-100 text-amber-700",
  },
  {
    type: "PRODUCT_DELETED",
    icon: Trash2,
    color: "bg-rose-100 text-rose-700",
  },
  {
    type: "ORDER_STATUS_CHANGED",
    icon: ShoppingCart,
    color: "bg-sky-100 text-sky-700",
  },
  {
    type: "COUPON_CREATED",
    icon: TicketPercent,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    type: "COUPON_UPDATED",
    icon: Edit,
    color: "bg-amber-100 text-amber-700",
  },
  {
    type: "COUPON_DELETED",
    icon: Trash2,
    color: "bg-rose-100 text-rose-700",
  },
  {
    type: "DISCOUNT_CREATED",
    icon: TicketPercent,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    type: "DISCOUNT_UPDATED",
    icon: Edit,
    color: "bg-amber-100 text-amber-700",
  },
  {
    type: "DISCOUNT_DELETED",
    icon: Trash2,
    color: "bg-rose-100 text-rose-700",
  },
  {
    type: "CUSTOMER_BLOCKED",
    icon: Trash2,
    color: "bg-rose-100 text-rose-700",
  },
  {
    type: "CUSTOMER_UNBLOCKED",
    icon: UserPlus,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    type: "REVIEW_UPDATED",
    icon: Edit,
    color: "bg-amber-100 text-amber-700",
  },
  {
    type: "REVIEW_DELETED",
    icon: Trash2,
    color: "bg-rose-100 text-rose-700",
  },
  {
    type: "ADMIN_LOGIN",
    icon: LogIn,
    color: "bg-blue-100 text-blue-700",
  },
  {
    type: "ADMIN_LOGOUT",
    icon: LogIn,
    color: "bg-slate-100 text-slate-700",
  },
  {
    type: "Category_CREATED",
    icon: Package,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    type: "Category_UPDATED",
    icon: Edit,
    color: "bg-amber-100 text-amber-700",
  },
  {
    type: "Category_DELETED",
    icon: Trash2,
    color: "bg-rose-100 text-rose-700",
  },
];

function formatRelativeTime(createdAt) {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  const diffInSeconds = Math.floor((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const ranges = [
    { unit: "year", seconds: 60 * 60 * 24 * 365 },
    { unit: "month", seconds: 60 * 60 * 24 * 30 },
    { unit: "day", seconds: 60 * 60 * 24 },
    { unit: "hour", seconds: 60 * 60 },
    { unit: "minute", seconds: 60 },
  ];

  for (const { unit, seconds } of ranges) {
    if (Math.abs(diffInSeconds) >= seconds) {
      return rtf.format(Math.round(diffInSeconds / seconds), unit);
    }
  }

  return rtf.format(diffInSeconds, "second");
}

export default function AdminActivityPage() {
  let content = null;
  const {
    data: logs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Adminactivities"],
    queryFn: getAdminActivityLog,
  });

  if (isLoading) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Activity Log"
          description="Loading your activities."
          breadcrumbs={[{ label: "Activity Log" }]}
        />
        <Loading message="Loading Activities" fullPage />
      </AdminLayout>
    );
  }

  if (error) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Activity Log"
          description="We could not load your activities right now."
          breadcrumbs={[{ label: "Activity Log" }]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load data.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (logs) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Activity Log"
          description="Track all admin actions and system events"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Activity Log" },
          ]}
        />

        <div className="bg-card rounded-xl border shadow-sm">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[29px] top-0 bottom-0 w-px bg-border" />

            {logs.map((activity, i) => {
              const matchedActivityType = suitableIconsForTypes.find(
                ({ type }) => type === activity.type
              );
              const ActivityIcon = matchedActivityType?.icon || Package;
              const activityColor =
                matchedActivityType?.color || "bg-muted text-muted-foreground";

              return (
                <div
                  key={i}
                  className="relative flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 z-10",
                      activityColor,
                    )}
                  >
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      by {activity.actorRole}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return content;
}
