import StatCard from "@/components/StatsCard/StatCard";
import Icon from "@/system/icons/Icon";
export default function StatsGrid({ stats }) {
  const statsData = [
    {
      id: "orders",
      icon: (
        <Icon name="orders" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: stats.totalOrders,
      label: "Total Orders",
    },
    {
      id: "wishlist",
      icon: (
        <Icon name="wishlist" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: stats.totalWishlist,
      label: "Wishlist",
    },
    {
      id: "reviews",
      icon: (
        <Icon name="reviews" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: stats.totalReviews,
      label: "Reviews",
    },
    {
      id: "spent",
      icon: (
        <Icon name="payment" size={24} strokeWidth={1.5} variant="primary" />
      ),
      value: stats.totalSpent,
      label: "Total Spent",
    },
  ];
  return (
    <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
}
