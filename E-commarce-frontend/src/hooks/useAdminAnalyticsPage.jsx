import { getAdminAnalytics } from "@/APIs/adminAnalitics";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const ANALYTICS_CHART_COLORS = [
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

function percentageChange(current, previous) {
  if (!previous) return "0.0";
  return (((current - previous) / previous) * 100).toFixed(1);
}

function direction(current, previous) {
  return current > previous ? "up" : "down";
}

function extractLastMonthData(data = []) {
  if (data.length < 3) return null;

  const lastMonthData = data[data.length - 2];
  const beforeLastMonthData = data[data.length - 3];

  return {
    totalRevenue: {
      lastMonth: lastMonthData.revenue,
      percentage: percentageChange(
        lastMonthData.revenue,
        beforeLastMonthData.revenue,
      ),
      behave: direction(lastMonthData.revenue, beforeLastMonthData.revenue),
    },
    ordersCount: {
      lastMonth: lastMonthData.ordersCount,
      percentage: percentageChange(
        lastMonthData.ordersCount,
        beforeLastMonthData.ordersCount,
      ),
      behave: direction(
        lastMonthData.ordersCount,
        beforeLastMonthData.ordersCount,
      ),
    },
    totalCustomers: {
      lastMonth: lastMonthData.customerNumberJoined,
      percentage: percentageChange(
        lastMonthData.customerNumberJoined,
        beforeLastMonthData.customerNumberJoined,
      ),
      behave: direction(
        lastMonthData.customerNumberJoined,
        beforeLastMonthData.customerNumberJoined,
      ),
    },
    avgOrderValue: {
      lastMonth: lastMonthData.avgOrderValue,
      percentage: percentageChange(
        lastMonthData.avgOrderValue,
        beforeLastMonthData.avgOrderValue,
      ),
      behave: direction(
        lastMonthData.avgOrderValue,
        beforeLastMonthData.avgOrderValue,
      ),
    },
  };
}

export default function useAdminAnalyticsPage() {
  const analyticsQuery = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
  });

  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  const conclusion = useMemo(
    () => extractLastMonthData(analyticsQuery.data?.monthlyRevenue),
    [analyticsQuery.data?.monthlyRevenue],
  );

  return {
    analytics: analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
    isFetching: analyticsQuery.isFetching,
    isError: analyticsQuery.isError,
    error: analyticsQuery.error,
    conclusion,
    colors: ANALYTICS_CHART_COLORS,
    format,
    rate,
  };
}
