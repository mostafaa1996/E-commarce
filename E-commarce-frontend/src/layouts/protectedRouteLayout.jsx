import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAuthStore} from "@/zustand_auth/authStore";
export default function ProtectedRouteLayout() {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  if (!isLoggedIn)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
