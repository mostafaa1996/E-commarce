import Icon from "@/system/icons/Icon";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {AdminButton} from "@/components/genericComponents/AdminButton";
import { Avatar, AvatarFallback } from "@/components/genericComponents/avatar";
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

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 4900 },
  { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 6100 },
  { month: "Jun", revenue: 8400 },
  { month: "Jul", revenue: 7800 },
  { month: "Aug", revenue: 9200 },
  { month: "Sep", revenue: 8600 },
  { month: "Oct", revenue: 10400 },
  { month: "Nov", revenue: 11200 },
  { month: "Dec", revenue: 9800 },
];

const recentOrders = [
  {
    id: "#ORD-2024-001",
    customer: "Ahmed Hassan",
    email: "ahmed@mail.com",
    total: "$96.79",
    date: "Mar 16, 2026",
    payment: "Paid",
    status: "Shipped",
  },
  {
    id: "#ORD-2024-002",
    customer: "Sara Ali",
    email: "sara@mail.com",
    total: "$142.50",
    date: "Mar 15, 2026",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD-2024-003",
    customer: "Mohamed Nour",
    email: "mohamed@mail.com",
    total: "$67.99",
    date: "Mar 15, 2026",
    payment: "Pending",
    status: "Processing",
  },
  {
    id: "#ORD-2024-004",
    customer: "Fatma Ibrahim",
    email: "fatma@mail.com",
    total: "$234.00",
    date: "Mar 14, 2026",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD-2024-005",
    customer: "Omar Khaled",
    email: "omar@mail.com",
    total: "$89.99",
    date: "Mar 14, 2026",
    payment: "Failed",
    status: "Cancelled",
  },
];

const topProducts = [
  { name: 'ECOPAD 10.1" Tablet', sold: 142, revenue: "$8,499" },
  { name: 'ZZA 32" 4K Monitor', sold: 98, revenue: "$16,562" },
  { name: "Smart Watch Pro", sold: 87, revenue: "$13,049" },
  { name: "Wireless Earbuds X3", sold: 76, revenue: "$3,039" },
  { name: "Seagate HDD 1TB", sold: 65, revenue: "$3,899" },
];

const lowStockProducts = [
  { name: "USB-C Hub Adapter", stock: 3, status: "Critical" },
  { name: "Laptop Stand Pro", stock: 5, status: "Low" },
  { name: "Mouse Pad XL", stock: 8, status: "Low" },
  { name: "HDMI Cable 2m", stock: 2, status: "Critical" },
];

const statusMap = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
  Delivered: "success",
  Shipped: "info",
  Processing: "pending",
  Cancelled: "danger",
  Critical: "danger",
  Low: "warning",
};

export default function DashboardPage() {
  return (
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
          value="$84,254"
          change="12.5% from last month"
          changeType="up"
          iconName={"dollarSign"}
          iconBg="bg-success/10"
        />
        <StatCard
          title="Total Orders"
          value="1,248"
          change="8.2% from last month"
          changeType="up"
          iconName={"cart"}
          iconBg="bg-info/10"
        />
        <StatCard
          title="Total Customers"
          value="3,642"
          change="4.1% from last month"
          changeType="up"
          iconName={"users"}
          iconBg="bg-warning/10"
        />
        <StatCard
          title="Total Products"
          value="456"
          change="2 new this week"
          changeType="neutral"
          iconName={"package"}
          iconBg="bg-primary/10"
        />
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Pending", count: 23, icon: "clock", color: "text-warning" },
          {
            label: "Paid",
            count: 156,
            icon: "dollarSign",
            color: "text-success",
          },
          { label: "Shipped", count: 42, icon: "truck", color: "text-info" },
          {
            label: "Delivered",
            count: 1024,
            icon: "checkCircle",
            color: "text-success",
          },
          {
            label: "Cancelled",
            count: 3,
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
          <AdminButton variant="outline" size="sm">
            View Report
          </AdminButton>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
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
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
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
            <AdminButton variant="ghost" size="sm" className="text-primary">
              View All <Icon name="arrowUpRight" className="h-3 w-3 ml-1 text-primary" />
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
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-primary">
                      {order.id}
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
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-muted-foreground w-5">
                    #{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sold} sold
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {product.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Low Stock Alerts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lowStockProducts.map((product, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.stock} units left
                </p>
              </div>
              <StatusBadge status={statusMap[product.status]}>
                {product.status}
              </StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
