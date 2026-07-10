import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAuthStore} from "@/zustand_auth/authStore";
import Loading from "@/components/genericComponents/Loading";
export default function ProtectedRouteLayout() {
  const { isLoggedIn, isAuthReady } = useAuthStore();
  const location = useLocation();
  if (!isAuthReady) return <Loading message="Checking session" fullPage />;
  if (!isLoggedIn)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
