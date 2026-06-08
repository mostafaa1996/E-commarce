import { SidebarProvider, SidebarInset } from "@/components/adminUI/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import useLogoutAction from "@/hooks/useLogoutAction";
import { getImportantUnreadNotificationsNumber } from "@/APIs/adminNotificationsService";
import { useQuery } from "@tanstack/react-query";

export function AdminLayout({ children }) {
  const { Logout } = useLogoutAction();
  const { data } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: getImportantUnreadNotificationsNumber,
  });
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar onLogout={Logout} />
      <SidebarInset>
        <AdminTopbar
          unreadNotifications={{
            link: "/profile/admin/notifications",
            count: data?.unreadNotificationsNumber || 0,
          }}
          logoutAction={Logout}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
