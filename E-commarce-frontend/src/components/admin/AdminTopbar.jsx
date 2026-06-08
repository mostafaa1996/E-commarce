import InputField from "@/components/genericComponents/InputField";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { SidebarTrigger } from "@/components/adminUI/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/adminUI/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/adminUI/avatar";
import Icon from "@/system/icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAdminUserForTopBar } from "@/APIs/adminSettingsService";
import { useNavigate } from "react-router-dom";

function getInitials(firstName, lastName, email) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (fullName) {
    return fullName
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  return email?.slice(0, 2).toUpperCase() || "AD";
}

export function AdminTopbar({ unreadNotifications, logoutAction }) {
  const navigate = useNavigate();
  const { data: profileForm } = useQuery({
    queryKey: ["AdminUserForTopBar"],
    queryFn: getAdminUserForTopBar,
  });
  const adminInitials = useMemo(
    () =>
      getInitials(
        profileForm?.firstName,
        profileForm?.lastName,
        profileForm?.email,
      ),
    [profileForm],
  );
  const adminFullName =
    [profileForm?.firstName, profileForm?.lastName].filter(Boolean).join(" ") ||
    "Super Admin";

  return (
    <header className="h-18 border-b bg-card flex items-center justify-between px-4 md:px-6 gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="relative hidden md:block">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <InputField
            placeholder="Search orders, products, customers..."
            className="pl-9 w-[320px] lg:w-[400px] bg-secondary border-0 h-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AdminButton
          onClick={() => navigate(unreadNotifications?.link || "/")}
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Icon name="notifications" className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
            {unreadNotifications?.count || 0}
          </span>
        </AdminButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {profileForm && adminFullName && (
              <AdminButton variant="ghost" className="gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profileForm?.avatar}
                    alt={adminFullName || "Super Admin"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {adminInitials || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">
                    Super Admin
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {adminFullName || "Super Admin"}
                  </span>
                </div>
                <Icon
                  name="chevronDown"
                  className="h-4 w-4 text-muted-foreground hidden md:block"
                />
              </AdminButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                navigate("/profile/admin/settings");
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logoutAction}
              className="text-destructive"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
