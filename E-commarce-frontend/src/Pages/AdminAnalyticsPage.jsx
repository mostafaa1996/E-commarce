import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { getAdminAnalytics } from "@/APIs/adminAnalitics";
import Loading from "@/components/genericComponents/Loading";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useCurrency from "@/hooks/CurrencyChange";

const COLORS = [
  "hsl(16, 90%, 55%)",
  "hsl(217, 91%, 60%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(29, 90%, 55%)",
  "hsl(42, 90%, 55%)",
  "hsl(38, 72%, 20%)",
  "hsl(240, 45%, 50%)",
  "hsl(19, 70%, 35%)",
];

const extractLastMonthData = (data) => {
  const LastMonthData = data[data.length - 2];
  const BeforeLastMonthData = data[data.length - 3];
  const conclusion = {
    totalRevenue: {
      lastMonth: LastMonthData.revenue,
      percentage:
        (((LastMonthData.revenue - BeforeLastMonthData.revenue) /
          BeforeLastMonthData.revenue) *
        100).toFixed(1),
      behave:
        LastMonthData.revenue > BeforeLastMonthData.revenue ? "up" : "down",
    },
    ordersCount: {
      lastMonth: LastMonthData.ordersCount,
      percentage:
        (((LastMonthData.ordersCount - BeforeLastMonthData.ordersCount) /
          BeforeLastMonthData.ordersCount) *
        100).toFixed(1),
      behave:
        LastMonthData.ordersCount > BeforeLastMonthData.ordersCount
          ? "up"
          : "down",
    },
    totalCustomers: {
      lastMonth: LastMonthData.customerNumberJoined,
      percentage:
        (((LastMonthData.customerNumberJoined - BeforeLastMonthData.customerNumberJoined) /
          BeforeLastMonthData.customerNumberJoined) *
        100).toFixed(1),
      behave:
        LastMonthData.customerNumberJoined > BeforeLastMonthData.customerNumberJoined
          ? "up"
          : "down",
    },
    avgOrderValue: {
      lastMonth: LastMonthData.avgOrderValue,
      percentage:
        (((LastMonthData.avgOrderValue - BeforeLastMonthData.avgOrderValue) /
          BeforeLastMonthData.avgOrderValue) *
        100).toFixed(1),
      behave:
        LastMonthData.avgOrderValue > BeforeLastMonthData.avgOrderValue
          ? "up"
          : "down",
    }
  };
  return conclusion;
};

export default function AdminAnalyticsPage() {
  let content = null;
  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
  });
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  if (isLoading || isFetching) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Analytics"
          description="Loading your store analytics."
          breadcrumbs={[{ label: "Analytics" }]}
        />
        <Loading message="Loading analytics" fullPage />
      </AdminLayout>
    );
  }

  if (error || isError) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Analytics"
          description="We could not load your store analytics right now."
          breadcrumbs={[{ label: "Analytics" }]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load data.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (analytics) {
    const conclusion = extractLastMonthData(analytics?.monthlyRevenue);
    content = (
      <AdminLayout>
        <PageHeader
          title="Analytics"
          description="Track your store performance and growth"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Analytics" },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Monthly Revenue"
            value={format(conclusion?.totalRevenue?.lastMonth * rate)}
            change={`${conclusion?.totalRevenue?.percentage}% vs last month`}
            changeType={conclusion?.totalRevenue?.behave}
            iconName={"poundSterling"}
            iconBg="bg-success/10"
          />
          <StatCard
            title="Monthly Orders"
            value={conclusion?.ordersCount?.lastMonth}
            change={`${conclusion?.ordersCount?.percentage}% vs last month`}
            changeType={conclusion?.ordersCount?.behave}
            iconName={"cart"}
            iconBg="bg-info/10"
          />
          <StatCard
            title="Avg Order Value"
            value={format(conclusion?.avgOrderValue?.lastMonth * rate)}
            change={`${conclusion?.avgOrderValue?.percentage}% vs last month`}
            changeType={conclusion?.avgOrderValue?.behave}
            iconName={"trendingUp"}
            iconBg="bg-primary/10"
          />
          <StatCard
            title="New Customers"
            value={conclusion?.totalCustomers?.lastMonth}
            change={`${conclusion?.totalCustomers?.percentage}% vs last month`}
            changeType={conclusion?.totalCustomers?.behave}
            iconName={"users"}
            iconBg="bg-warning/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-base font-semibold text-foreground mb-8">
              Revenue & Orders
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={analytics?.monthlyRevenue}
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(220, 13%, 91%)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  orientation="left"
                  label={{
                    value: "Revenue",
                    angle: -90,
                    position: "insideLeft",
                    offset: -20,
                    dy: 0,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Orders",
                    angle: -90,
                    position: "insideRight",
                    offset: -10,
                    dy: -50,
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  yAxisId="left"
                  fill="hsl(16, 90%, 55%)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="ordersCount"
                  yAxisId="right"
                  fill="hsl(217, 91%, 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Sales by Category
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={analytics?.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="percentage"
                  nameKey="categoryName"
                  label={({ categoryName, percentage }) =>
                    `${categoryName} ${percentage.toFixed(0)}%`
                  }
                >
                  {analytics?.categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Top Selling Products
          </h3>
          <div className="space-y-3">
            {analytics?.topProducts?.map((product, i) => (
              <div
                key={`product - ${product.productTitle}`}
                className="flex items-center gap-4"
              >
                <span className="text-sm font-bold text-muted-foreground w-6">
                  #{i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {product.productTitle}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {format(product.revenue * rate)}
                    </p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${
                          (product.revenue / analytics?.HighestInTopProducts) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.count} units sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
