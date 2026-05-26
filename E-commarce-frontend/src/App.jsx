import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { getExchangeRate } from "./APIs/ExchangeRateService";
import { useQuery } from "@tanstack/react-query";
import Loading from "./components/genericComponents/Loading";

function App() {
  useQuery({
    queryKey: ["exchange-rate"],
    queryFn: getExchangeRate,
    staleTime: Infinity,
  });
  return <RouterProvider router={router} fallbackElement={<Loading fullPage />} />;
}

export default App;
