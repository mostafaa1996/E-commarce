import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 4200, orders: 120 }, { month: "Feb", revenue: 5800, orders: 145 },
  { month: "Mar", revenue: 4900, orders: 132 }, { month: "Apr", revenue: 7200, orders: 178 },
  { month: "May", revenue: 6100, orders: 155 }, { month: "Jun", revenue: 8400, orders: 198 },
];

const categoryData = [
  { name: "Tablets", value: 35 }, { name: "Monitors", value: 25 },
  { name: "Wearables", value: 20 }, { name: "Audio", value: 12 },
  { name: "Other", value: 8 },
];

const COLORS = ["hsl(16, 90%, 55%)", "hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 60%)"];

const topProducts = [
  { name: "ECOPAD 10.1\" Tablet", revenue: 8499, units: 142 },
  { name: "ZZA 32\" 4K Monitor", revenue: 16562, units: 98 },
  { name: "Smart Watch Pro", revenue: 13049, units: 87 },
  { name: "Wireless Earbuds X3", revenue: 3039, units: 76 },
  { name: "Seagate HDD 1TB", revenue: 3899, units: 65 },
];

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Analytics"
        description="Track your store performance and growth"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Analytics" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Monthly Revenue" value="$8,400" change="12.5% vs last month" changeType="up" iconName={"dollarSign"} iconBg="bg-success/10" />
        <StatCard title="Monthly Orders" value="198" change="8.2% vs last month" changeType="up" iconName={"cart"} iconBg="bg-info/10" />
        <StatCard title="Avg Order Value" value="$42.42" change="3.8% vs last month" changeType="up" iconName={"trendingUp"} iconBg="bg-primary/10" />
        <StatCard title="New Customers" value="64" change="15% vs last month" changeType="up" iconName={"users"} iconBg="bg-warning/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Revenue & Orders</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(16, 90%, 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Top Selling Products</h3>
        <div className="space-y-3">
          {topProducts.map((product, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-sm font-semibold text-foreground">${product.revenue.toLocaleString()}</p>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(product.revenue / 16562) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{product.units} units sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}