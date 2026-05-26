import { getUserProfileData } from "@/APIs/UserProfileService";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { useQuery } from "@tanstack/react-query";
import Icon from "@/system/icons/Icon";
import { useMemo } from "react";

export default function useUserProfilePage() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfileData,
  });

  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  const statsData = useMemo(() => [
    {
      id: "orders",
      icon: (
        <Icon name="orders" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: profileQuery?.data?.StatsData?.totalOrders,
      label: "Total Orders",
    },
    {
      id: "wishlist",
      icon: (
        <Icon name="wishlist" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: profileQuery?.data?.StatsData?.totalWishlist,
      label: "Wishlist",
    },
    {
      id: "reviews",
      icon: (
        <Icon name="reviews" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: profileQuery?.data?.StatsData?.totalReviews,
      label: "Reviews",
    },
    {
      id: "spent",
      icon: (
        <Icon name="payment" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: profileQuery?.data?.StatsData?.totalSpent,
      label: "Total Spent",
    },
  ] , [profileQuery?.data?.StatsData]);

  function getStatusColor(status) {
    return (
      profileQuery.data?.statusStyles?.[status] || "bg-zinc-200 text-black"
    );
  }

  function getPaymentStatusColor(paymentStatus) {
    return (
      profileQuery.data?.paymentStatusStyles?.[paymentStatus] ||
      "bg-zinc-200 text-black"
    );
  }

  function formatPrice(price) {
    return format(price * rate);
  }

  return {
    data: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    statsData: statsData,
    getStatusColor,
    getPaymentStatusColor,
    formatPrice,
  };
}
