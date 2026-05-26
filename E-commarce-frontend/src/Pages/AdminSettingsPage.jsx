import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/adminUI/AdminButton";
import InputField from "@/components/genericComponents/InputField";
import PhoneField from "@/components/genericComponents/PhoneField";
import { Label } from "@/components/genericComponents/Label";
import { Separator } from "@/components/adminUI/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/adminUI/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/adminUI/tabs";
import Loading from "@/components/genericComponents/Loading";
import useAdminSettingsPage, {
  DEFAULT_PROFILE,
  DEFAULT_STORE,
} from "@/hooks/useAdminSettingsPage";

export default function AdminSettingsPage() {
  let content = null;
  const {
    settings,
    isLoading,
    isFetching,
    error,
    avatarInputRef,
    avatarSource,
    profileForm,
    storeForm,
    passwordForm,
    adminInitials,
    adminFullName,
    updateProfileField,
    updateStoreField,
    updatePasswordField,
    handleAvatarButtonClick,
    handleAvatarChange,
    updateProfile,
    updatePassword,
    updateStore,
  } = useAdminSettingsPage();

  if ((isLoading || isFetching) && !settings) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Settings"
          description="Loading your profile and store settings."
          breadcrumbs={[{ label: "Settings" }]}
        />
        <Loading message="Loading settings" fullPage />
      </AdminLayout>
    );
  }

  if (error && !settings) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Settings"
          description="We could not load your settings right now."
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Settings" },
          ]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load data.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (settings) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Settings"
          description="Manage your profile and store settings"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Settings" },
          ]}
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
                  <AvatarImage src={avatarSource} alt={adminFullName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {adminInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {adminFullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {profileForm.email}
                  </p>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <AdminButton
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAvatarButtonClick}
                  >
                    Change Avatar
                  </AdminButton>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-first-name">First Name</Label>
                  <InputField
                    id="admin-first-name"
                    placeholder={DEFAULT_PROFILE.firstName}
                    value={profileForm.firstName}
                    onChange={(event) =>
                      updateProfileField("firstName", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-last-name">Last Name</Label>
                  <InputField
                    id="admin-last-name"
                    placeholder={DEFAULT_PROFILE.lastName}
                    value={profileForm.lastName}
                    onChange={(event) =>
                      updateProfileField("lastName", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <InputField
                    id="admin-email"
                    placeholder={DEFAULT_PROFILE.email}
                    value={profileForm.email}
                    type="email"
                    onChange={(event) =>
                      updateProfileField("email", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Phone</Label>
                  <PhoneField
                    id="admin-phone"
                    defaultCountry="EG"
                    value={profileForm.phone}
                    placeholder={DEFAULT_PROFILE.phone}
                    onChange={(event) =>
                      updateProfileField("phone", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <AdminButton
                  onClick={() => updateProfile(profileForm)}
                  type="button"
                >
                  Save Changes
                </AdminButton>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="store">
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
              <h3 className="text-base font-semibold text-foreground">
                Store Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <InputField
                    id="store-name"
                    placeholder={DEFAULT_STORE.storeName}
                    value={storeForm.storeName}
                    onChange={(event) =>
                      updateStoreField("storeName", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <InputField
                    id="support-email"
                    placeholder={DEFAULT_STORE.supportEmail}
                    value={storeForm.supportEmail}
                    type="email"
                    onChange={(event) =>
                      updateStoreField("supportEmail", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone</Label>
                  <PhoneField
                    id="store-phone"
                    defaultCountry="EG"
                    value={storeForm.phone}
                    placeholder={DEFAULT_STORE.phone}
                    onChange={(event) =>
                      updateStoreField("phone", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-fee">Shipping Fee</Label>
                  <InputField
                    id="shipping-fee"
                    placeholder={DEFAULT_STORE.shippingFee}
                    value={storeForm.shippingFee}
                    type="number"
                    onChange={(event) =>
                      updateStoreField("shippingFee", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-address">Address</Label>
                  <InputField
                    id="store-address"
                    placeholder={DEFAULT_STORE.address}
                    value={storeForm.address}
                    onChange={(event) =>
                      updateStoreField("address", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working-days">Working Days</Label>
                  <InputField
                    id="store-working-days"
                    placeholder={DEFAULT_STORE.workingDays}
                    value={storeForm.workingDays}
                    onChange={(event) =>
                      updateStoreField("workingDays", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <AdminButton onClick={() => updateStore(storeForm)} type="button">
                  Save Settings
                </AdminButton>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
              <h3 className="text-base font-semibold text-foreground">
                Change Password
              </h3>
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <InputField
                    type="password"
                    placeholder="********"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      updatePasswordField("currentPassword", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <InputField
                    type="password"
                    placeholder="********"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      updatePasswordField("newPassword", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <InputField
                    type="password"
                    placeholder="********"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      updatePasswordField("confirmPassword", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <AdminButton
                  onClick={() => updatePassword(passwordForm)}
                  type="button"
                >
                  Update Password
                </AdminButton>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
