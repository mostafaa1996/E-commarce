import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Warehouse,
  TicketPercent, Star, Bell, Settings, BarChart3, Activity, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/adminUI/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/adminUI/sidebar";

const mainURL = "/profile/admin";

const mainNav = [
  { title: "Dashboard", url: mainURL + "/dashboard" , icon: LayoutDashboard },
  { title: "Products", url: mainURL +"/products", icon: Package },
  { title: "Categories", url: mainURL +"/categories", icon: FolderTree },
  { title: "Orders", url: mainURL +"/orders", icon: ShoppingCart },
  { title: "Customers", url: mainURL +"/customers", icon: Users },
  { title: "Inventory", url: mainURL +"/inventory", icon: Warehouse },
];

const secondaryNav = [
  { title: "Coupons", url: mainURL +"/coupons", icon: TicketPercent },
  { title: "Reviews", url: mainURL +"/reviews", icon: Star },
  { title: "Analytics", url: mainURL +"/analytics", icon: BarChart3 },
  { title: "Activity Log", url: mainURL +"/activity", icon: Activity },
];

const settingsNav = [
  { title: "Notifications", url: mainURL +"/notifications", icon: Bell },
  { title: "Settings", url: mainURL +"/settings", icon: Settings },
];

function NavSection({ items, label, collapsed }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        {!collapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar({ onLogout }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                <span className="text-foreground">SHOP</span>
                <span className="text-muted-foreground font-normal">LITE</span>
              </h1>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <NavSection items={mainNav} label="Main" collapsed={collapsed} />
        <NavSection items={secondaryNav} label="Marketing" collapsed={collapsed} />
        <NavSection items={settingsNav} label="System" collapsed={collapsed} />
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => {onLogout()}}
              className="text-destructive hover:bg-destructive/10 gap-3 px-3 py-2">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
