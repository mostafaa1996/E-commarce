import {
  Bell,
  ShoppingBag,
  CreditCard,
  ReceiptText,
  PackageMinus,
  TriangleAlert,
  PackageX,
  MessageSquareText,
  ThumbsDown,
  ClipboardCheck,
  Mail,
  RotateCcw,
  CircleSlash,
  UserPlus,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { cn } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAdminNotifications,
  updateAllAdminNotificationStatus,
  updateAdminNotificationStatus,
} from "@/APIs/adminNotificationsService.js";
import {queryClient} from "../queryClient";
import Loading from "@/components/genericComponents/Loading";

const notificationIcons = {
  NEW_ORDER: ShoppingBag,
  PAYMENT_FAILED: CreditCard,
  PAYMENT_REFUNDED: ReceiptText,
  LOW_STOCK: PackageMinus,
  CRITICAL_STOCK: TriangleAlert,
  OUT_OF_STOCK: PackageX,
  NEW_REVIEW: MessageSquareText,
  NEGATIVE_REVIEW: ThumbsDown,
  REVIEW_REQUIRES_APPROVAL: ClipboardCheck,
  NEW_CONTACT_MESSAGE: Mail,
  RETURN_REQUEST: RotateCcw,
  CANCELLATION_REQUEST: CircleSlash,
  NEW_CUSTOMER_SIGNUP: UserPlus,
};
function NotificationIcon({ type, className }) {
  const Icon = notificationIcons[type] || Bell;

  return <Icon className={className} size={20} />;
}


export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAdminNotifications,
  });
  const notificationsMutate = useMutation({
    mutationFn: (id) => updateAdminNotificationStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
  const AllNotificationsMutate = useMutation({
    mutationFn: updateAllAdminNotificationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
  if (isLoading && !notifications) {
    return (
      <AdminLayout>
        <PageHeader
          title="Notifications"
          description="Loading your latest store Notifications."
          breadcrumbs={[{ label: "Notifications" }]}
        />
        <Loading message="Loading Notifications" fullPage />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <PageHeader
          title="Notifications"
          description="We could not load your store Notifications right now."
          breadcrumbs={[{ label: "Notifications" }]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load Notifications.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        description="Stay updated with your store activity"
        breadcrumbs={[
          { label: "Dashboard", href: "/profile/admin/dashboard" },
          { label: "Notifications" },
        ]}
        actions={
          <AdminButton
            onClick={() => AllNotificationsMutate.mutate()}
            variant="outline"
            size="sm"
          >
            Mark all as read
          </AdminButton>
        }
      />

      {notifications ? (
        <div className="bg-card rounded-xl border shadow-sm divide-y">
          {notifications?.map((notif) => (
            <button
              key={notif._id}
              onClick={() => {
                notificationsMutate.mutate(notif._id);
                navigate(`${notif.link}`);
              }}
              className={cn(
                "w-full flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors",
                !notif.read && "bg-primary/[0.02]",
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  notif.typeColor,
                )}
              >
                <NotificationIcon type={notif.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      !notif.read ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="w-fit text-sm text-muted-foreground mt-0.5">
                  {notif.message}
                </p>
                <p className="w-fit text-xs text-muted-foreground/70 mt-1">
                  {notif.relativeTime}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm divide-y">
          <div className="w-full flex items-start gap-4 p-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  No notifications
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
