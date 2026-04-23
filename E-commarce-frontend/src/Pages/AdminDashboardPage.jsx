import Icon from "@/system/icons/Icon";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { Avatar, AvatarFallback } from "@/components/adminUI/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/APIs/adminDashboardService";
import Loading from "@/components/genericComponents/Loading";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useCurrency from "@/hooks/CurrencyChange";
import { useNavigate } from "react-router-dom";
import { shortenText } from "@/utils/utils";

// Dummy Data for revenue chart
// const revenueData = [
//   { month: "Jan", revenue: 4200 },
//   { month: "Feb", revenue: 5800 },
//   { month: "Mar", revenue: 4900 },
//   { month: "Apr", revenue: 7200 },
//   { month: "May", revenue: 6100 },
//   { month: "Jun", revenue: 8400 },
//   { month: "Jul", revenue: 7800 },
//   { month: "Aug", revenue: 9200 },
//   { month: "Sep", revenue: 8600 },
//   { month: "Oct", revenue: 10400 },
//   { month: "Nov", revenue: 11200 },
//   { month: "Dec", revenue: 9800 },
// ];
// Dummy Data for recent orders
// const recentOrders = [
//   {
//     id: "#ORD-2024-001",
//     customer: "Ahmed Hassan",
//     email: "ahmed@mail.com",
//     total: "$96.79",
//     date: "Mar 16, 2026",
//     payment: "Paid",
//     status: "Shipped",
//   },
//   {
//     id: "#ORD-2024-002",
//     customer: "Sara Ali",
//     email: "sara@mail.com",
//     total: "$142.50",
//     date: "Mar 15, 2026",
//     payment: "Paid",
//     status: "Delivered",
//   },
//   {
//     id: "#ORD-2024-003",
//     customer: "Mohamed Nour",
//     email: "mohamed@mail.com",
//     total: "$67.99",
//     date: "Mar 15, 2026",
//     payment: "Pending",
//     status: "Processing",
//   },
//   {
//     id: "#ORD-2024-004",
//     customer: "Fatma Ibrahim",
//     email: "fatma@mail.com",
//     total: "$234.00",
//     date: "Mar 14, 2026",
//     payment: "Paid",
//     status: "Delivered",
//   },
//   {
//     id: "#ORD-2024-005",
//     customer: "Omar Khaled",
//     email: "omar@mail.com",
//     total: "$89.99",
//     date: "Mar 14, 2026",
//     payment: "Failed",
//     status: "Cancelled",
//   },
// ];
// Dummy Data for top products
// const topProducts = [
//   { name: 'ECOPAD 10.1" Tablet', sold: 142, revenue: "$8,499" },
//   { name: 'ZZA 32" 4K Monitor', sold: 98, revenue: "$16,562" },
//   { name: "Smart Watch Pro", sold: 87, revenue: "$13,049" },
//   { name: "Wireless Earbuds X3", sold: 76, revenue: "$3,039" },
//   { name: "Seagate HDD 1TB", sold: 65, revenue: "$3,899" },
// ];
// Dummy Data for low stock products
// const lowStockProducts = [
//   { name: "USB-C Hub Adapter", stock: 3, status: "Critical" },
//   { name: "Laptop Stand Pro", stock: 5, status: "Low" },
//   { name: "Mouse Pad XL", stock: 8, status: "Low" },
//   { name: "HDMI Cable 2m", stock: 2, status: "Critical" },
// ];

const statusMap = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  delivered: "success",
  shipped: "info",
  processing: "pending",
  cancelled: "danger",
  Critical: "danger",
  Low: "warning",
  refunded: "danger",
  returned: "danger",
  not_required: "success",
};

function growthDirection(value) {
  return value > 0 ? "up" : "down";
}

function CurrencySigndetermine(currency) {
  if (currency === "USD") return "dollarSign";
  if (currency === "EUR") return "euro";
  if (currency === "EGP") return "poundSterling";
  return "";
}

function currencySignForGraph(currency) {
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  if (currency === "EGP") return "£";
  return "";
}

export default function DashboardPage() {
  let content = null;
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const {
    data: dashboardData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
  const navigate = useNavigate();

  if (isLoading || isFetching) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Dashboard"
          description="Loading your latest store overview."
          breadcrumbs={[{ label: "Dashboard" }]}
        />
        <Loading message="Loading dashboard" fullPage />
      </AdminLayout>
    );
  }

  if (error) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Dashboard"
          description="We could not load your store overview right now."
          breadcrumbs={[{ label: "Dashboard" }]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load dashboard data.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (dashboardData) {
    const {
      overview,
      orderStatusSummary,
      revenueOverview,
      recentOrders,
      topSellingProducts,
      lowStockAlerts,
    } = dashboardData;
    content = (
      <AdminLayout>
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's your store overview."
          breadcrumbs={[{ label: "Dashboard" }]}
        />
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Revenue"
            value={format(Number(overview?.totalRevenue) * rate || 0)}
            change={overview?.revenueChangePercentage || 0}
            changeType={growthDirection(
              overview?.revenueChangePercentage || "neutral",
            )}
            iconName={CurrencySigndetermine(currency)}
            iconBg="bg-success/10"
          />
          <StatCard
            title="Total Orders"
            value={overview?.totalOrders || 0}
            change={overview?.ordersChangePercentage || 0}
            changeType={
              growthDirection(overview?.ordersChangePercentage) || "neutral"
            }
            iconName={"cart"}
            iconBg="bg-info/10"
          />
          <StatCard
            title="Total Customers"
            value={overview?.totalCustomers || 0}
            change={overview?.customersChangePercentage || 0}
            changeType={
              growthDirection(overview?.customersChangePercentage) || "neutral"
            }
            iconName={"users"}
            iconBg="bg-warning/10"
          />
          <StatCard
            title="Total Products"
            value={overview?.totalProducts}
            change={`${overview?.newProductsThisWeek || 0} new this week`}
            changeType="neutral"
            iconName={"package"}
            iconBg="bg-primary/10"
          />
        </div>

        {/* Order Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            {
              label: "Pending",
              count: orderStatusSummary?.pending || 0,
              icon: "clock",
              color: "text-warning",
            },
            {
              label: "Paid",
              count: orderStatusSummary?.paid || 0,
              icon: "dollarSign",
              color: "text-success",
            },
            {
              label: "Shipped",
              count: orderStatusSummary?.shipped || 0,
              icon: "truck",
              color: "text-info",
            },
            {
              label: "Delivered",
              count: orderStatusSummary?.delivered || 0,
              icon: "checkCircle",
              color: "text-success",
            },
            {
              label: "Cancelled",
              count: orderStatusSummary?.cancelled || 0,
              icon: "xCircle",
              color: "text-destructive",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card rounded-xl border p-6 flex items-center gap-3"
            >
              <Icon name={s.icon} className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="text-lg font-bold text-foreground">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Revenue Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                Monthly revenue for 2026
              </p>
            </div>
            <AdminButton
              onClick={() => navigate("/profile/admin/analytics")}
              variant="outline"
              size="sm"
            >
              View Report
            </AdminButton>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueOverview}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(16, 90%, 55%)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(16, 90%, 55%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(220, 13%, 91%)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v ? `${currencySignForGraph(currency)}${v / 1000}k` : ""
                }
              />
              <Tooltip
                formatter={(value) => [
                  value
                    ? `${currencySignForGraph(
                        currency,
                      )}${value.toLocaleString()}`
                    : "",
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(16, 90%, 55%)"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm">
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-base font-semibold text-foreground">
                Recent Orders
              </h3>
              <AdminButton
                onClick={() => {
                  navigate("/profile/admin/orders");
                }}
                variant="ghost"
                size="sm"
                className="text-primary"
              >
                View All{" "}
                <Icon
                  name="arrowUpRight"
                  className="h-3 w-3 ml-1 text-primary"
                />
              </AdminButton>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t bg-secondary/30">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-muted-foreground">
                      Order
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-muted-foreground">
                      Payment
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders &&
                    Array.isArray(recentOrders) &&
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-6 py-3 font-medium text-primary">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px] bg-secondary">
                                {order.customer
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {order.customer}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-semibold text-foreground">
                          {order.total}
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge status={statusMap[order.payment]}>
                            {order.payment}
                          </StatusBadge>
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge status={statusMap[order.status]}>
                            {order.status}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Selling */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Top Selling Products
            </h3>
            <div className="space-y-4">
              {(topSellingProducts &&
                Array.isArray(topSellingProducts) &&
                topSellingProducts.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground w-5">
                        #{i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {shortenText(product.name, 20)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.sold} sold
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                      {format(product.revenue * rate)}
                    </p>
                  </div>
                ))) || (
                <p className="text-sm text-muted-foreground">
                  No products found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">
              Low Stock Alerts
            </h3>
            <AdminButton
              onClick={() => navigate("/profile/admin/inventory")}
              variant="Ghost"
              size="sm"
              className="text-primary"
            >
              View All{" "}
              <Icon name="arrowUpRight" className="h-3 w-3 ml-1 text-primary" />
            </AdminButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(lowStockAlerts &&
              Array.isArray(lowStockAlerts) &&
              lowStockAlerts.slice(0, 8).map((product, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {shortenText(product.name, 20)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {shortenText(product.sku, 20)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.stock} units left
                    </p>
                  </div>
                  <StatusBadge status={statusMap[product.status]}>
                    {product.status}
                  </StatusBadge>
                </div>
              ))) || (
              <p className="text-sm text-muted-foreground">
                No low stock alerts
              </p>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
