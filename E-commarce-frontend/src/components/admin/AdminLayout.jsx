import {
  SidebarProvider,
  SidebarInset,
} from "@/components/adminUI/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { logoutAction } from "@/APIs/AuthService";
import { useNavigate } from "react-router-dom";

export function AdminLayout({ children }) {
  const navigate = useNavigate();
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar onLogout={() => {
        logoutAction();
        navigate("/login");
      }} />
      <SidebarInset>
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
