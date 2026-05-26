import { getAdminDashboard } from "@/APIs/adminDashboardService";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function growthDirection(value) {
  return value > 0 ? "up" : "down";
}

function currencyIconName(currency) {
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

export default function useAdminDashboardPage() {
  const navigate = useNavigate();
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  return {
    dashboardData: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isFetching: dashboardQuery.isFetching,
    error: dashboardQuery.error,
    currency,
    format,
    rate,
    navigate,
    growthDirection,
    currencyIconName,
    currencySignForGraph,
  };
}
