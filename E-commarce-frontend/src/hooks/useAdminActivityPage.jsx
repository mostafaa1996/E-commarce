import {
  Edit,
  LogIn,
  Package,
  ShoppingCart,
  TicketPercent,
  Trash2,
  UserPlus,
} from "lucide-react";
import { getAdminActivityLog } from "@/APIs/adminActivityLog";
import { useQuery } from "@tanstack/react-query";

const activityTypes = [
  { type: "PRODUCT_CREATED", icon: Package, color: "bg-emerald-100 text-emerald-700" },
  { type: "PRODUCT_UPDATED", icon: Edit, color: "bg-amber-100 text-amber-700" },
  { type: "PRODUCT_DELETED", icon: Trash2, color: "bg-rose-100 text-rose-700" },
  { type: "ORDER_STATUS_CHANGED", icon: ShoppingCart, color: "bg-sky-100 text-sky-700" },
  { type: "COUPON_CREATED", icon: TicketPercent, color: "bg-emerald-100 text-emerald-700" },
  { type: "COUPON_UPDATED", icon: Edit, color: "bg-amber-100 text-amber-700" },
  { type: "COUPON_DELETED", icon: Trash2, color: "bg-rose-100 text-rose-700" },
  { type: "DISCOUNT_CREATED", icon: TicketPercent, color: "bg-emerald-100 text-emerald-700" },
  { type: "DISCOUNT_UPDATED", icon: Edit, color: "bg-amber-100 text-amber-700" },
  { type: "DISCOUNT_DELETED", icon: Trash2, color: "bg-rose-100 text-rose-700" },
  { type: "CUSTOMER_BLOCKED", icon: Trash2, color: "bg-rose-100 text-rose-700" },
  { type: "CUSTOMER_UNBLOCKED", icon: UserPlus, color: "bg-emerald-100 text-emerald-700" },
  { type: "REVIEW_UPDATED", icon: Edit, color: "bg-amber-100 text-amber-700" },
  { type: "REVIEW_DELETED", icon: Trash2, color: "bg-rose-100 text-rose-700" },
  { type: "ADMIN_LOGIN", icon: LogIn, color: "bg-blue-100 text-blue-700" },
  { type: "ADMIN_LOGOUT", icon: LogIn, color: "bg-slate-100 text-slate-700" },
  { type: "Category_CREATED", icon: Package, color: "bg-emerald-100 text-emerald-700" },
  { type: "Category_UPDATED", icon: Edit, color: "bg-amber-100 text-amber-700" },
  { type: "Category_DELETED", icon: Trash2, color: "bg-rose-100 text-rose-700" },
];

export function formatRelativeTime(createdAt) {
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

export default function useAdminActivityPage() {
  const activityQuery = useQuery({
    queryKey: ["Adminactivities"],
    queryFn: getAdminActivityLog,
  });

  function getActivityMeta(type) {
    return (
      activityTypes.find((activityType) => activityType.type === type) || {
        icon: Package,
        color: "bg-muted text-muted-foreground",
      }
    );
  }

  return {
    logs: activityQuery.data,
    isLoading: activityQuery.isLoading,
    error: activityQuery.error,
    getActivityMeta,
    formatRelativeTime,
  };
}
