import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/adminUI/AdminButton";
import  InputField  from "@/components/genericComponents/InputField";
import { Label } from "@/components/genericComponents/Label";
import { Separator } from "@/components/adminUI/separator";
import { Avatar, AvatarFallback } from "@/components/adminUI/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/adminUI/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/adminUI/select";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Settings"
        description="Manage your profile and store settings"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]}
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="store">Store Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">AD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Admin User</h3>
                <p className="text-sm text-muted-foreground">Super Admin</p>
                <AdminButton variant="outline" size="sm" className="mt-2">Change Avatar</AdminButton>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First Name</Label><InputField defaultValue="Admin" /></div>
              <div className="space-y-2"><Label>Last Name</Label><InputField defaultValue="User" /></div>
              <div className="space-y-2"><Label>Email</Label><InputField defaultValue="admin@shoplite.com" type="email" /></div>
              <div className="space-y-2"><Label>Phone</Label><InputField defaultValue="+20 123 456 789" /></div>
            </div>
            <div className="flex justify-end"><AdminButton>Save Changes</AdminButton></div>
          </div>
        </TabsContent>

        <TabsContent value="store">
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
            <h3 className="text-base font-semibold text-foreground">Store Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Store Name</Label><InputField defaultValue="ShopLite" /></div>
              <div className="space-y-2"><Label>Support Email</Label><InputField defaultValue="support@shoplite.com" /></div>
              <div className="space-y-2"><Label>Phone</Label><InputField defaultValue="+20 112 233 44455" /></div>
              <div className="space-y-2"><Label>Currency</Label>
                <Select defaultValue="usd"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="usd">USD ($)</SelectItem><SelectItem value="egp">EGP (E£)</SelectItem><SelectItem value="eur">EUR (€)</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Shipping Fee</Label><InputField defaultValue="16.79" type="number" /></div>
              <div className="space-y-2"><Label>Address</Label><InputField defaultValue="Alexandria, Egypt" /></div>
            </div>
            <div className="flex justify-end"><AdminButton>Save Settings</AdminButton></div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
            <h3 className="text-base font-semibold text-foreground">Change Password</h3>
            <div className="max-w-md space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><InputField type="password" /></div>
              <div className="space-y-2"><Label>New Password</Label><InputField type="password" /></div>
              <div className="space-y-2"><Label>Confirm New Password</Label><InputField type="password" /></div>
            </div>
            <div className="flex justify-end"><AdminButton>Update Password</AdminButton></div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}