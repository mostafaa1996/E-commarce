import Icon from "@/system/icons/Icon";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import InputField from "@/components/genericComponents/InputField";
import { Avatar, AvatarFallback } from "@/components/adminUI/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/adminUI/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";
import { Separator } from "@/components/adminUI/separator";
import Loading from "@/components/genericComponents/Loading";
import { AlertCircle } from "lucide-react";
import { shortenText } from "@/utils/utils";
import useAdminCustomersPage from "@/hooks/useAdminCustomersPage";

export default function AdminCustomersPage() {
  let content = null;
  const {
    customersData,
    customers,
    customerData,
    isLoading,
    isFetching,
    error,
    errorCustomer,
    isCustomerDetailsLoading,
    isUpdatingCustomerStatus,
    updateUrlQuery,
    searchInput,
    setSearchInput,
    selectedStatus,
    setSelectedStatus,
    selectedCustomerId,
    setSelectedCustomerId,
    spentarrangement,
    setSpentarrangement,
    mutateCustomerStatus,
    resetFilters,
    isQueryChanged,
    getCustomerStatusVariant,
  } = useAdminCustomersPage();

  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {item.name
                .split(" ")
                .map((namePart) => namePart[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (item) => <span className="font-semibold">{item.phone}</span>,
    },
    {
      key: "date",
      header: "Joined",
      render: (item) => <span className="font-semibold">{item.date}</span>,
    },
    {
      key: "orders",
      header: "Orders",
      render: (item) => (
        <span className="font-semibold">{item.totalOrders}</span>
      ),
    },
    {
      key: "spent",
      header: "Total Spent",
      render: (item) => (
        <span className="font-semibold">{item.totalSpent.toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={getCustomerStatusVariant(item.status)}>
          {item.status}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item) => (
        <AdminButton
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedCustomerId(item.id)}
        >
          <Icon name="eye" className="h-4 w-4" />
        </AdminButton>
      ),
    },
  ];

  if ((isLoading || isFetching) && !customersData) {
    content = <Loading message="Loading customers" fullPage />;
  }

  if (error && !customersData) {
    content = (
      <AdminLayout>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (customersData) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Customers"
          description="Manage your customer base"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Customers" },
          ]}
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <InputField
              placeholder="Search customers..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {isQueryChanged && (
            <AdminButton
              onClick={resetFilters}
              variant="ghost"
              className="w-full sm:w-auto"
            >
              Clear Filters
            </AdminButton>
          )}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {customersData.statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={spentarrangement} onValueChange={setSpentarrangement}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Spent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low to high">Low to High</SelectItem>
              <SelectItem value="high to low">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={customers}
          page={customersData.pagination.page}
          totalPages={customersData.pagination.totalPages}
          onPageChange={(page) => updateUrlQuery({ page })}
        />

        <Sheet
          open={!!selectedCustomerId}
          onOpenChange={() => setSelectedCustomerId(null)}
        >
          <SheetContent className="w-[800px] sm:max-w-[800px]">
            <SheetHeader>
              <SheetTitle>Customer Details</SheetTitle>
              <SheetDescription>View customer information</SheetDescription>
            </SheetHeader>
            {isCustomerDetailsLoading && <Loading message="Loading customer" />}
            {errorCustomer && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{errorCustomer.message}</p>
                  </div>
                </div>
              </div>
            )}
            {customerData?.customer && (
              <div className="mt-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                        {customerData.customer.name
                          .split(" ")
                          .map((namePart) => namePart[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {customerData.customer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Member since {customerData.customer.createdAt}
                      </p>
                    </div>
                  </div>
                  <AdminButton
                    variant={
                      customerData.customer.status === "blocked"
                        ? "outline"
                        : "destructive"
                    }
                    size="sm"
                    disabled={isUpdatingCustomerStatus}
                    onClick={() =>
                      mutateCustomerStatus({
                        customerId:
                          customerData.customer.id || customerData.customer._id,
                        status:
                          customerData.customer.status === "blocked"
                            ? "active"
                            : "blocked",
                      })
                    }
                  >
                    {isUpdatingCustomerStatus
                      ? "Updating..."
                      : customerData.customer.status === "blocked"
                        ? "Unblock User"
                        : "Block User"}
                  </AdminButton>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">
                      {shortenText(customerData.customer.email, 20)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">
                      {customerData.customer.phone}
                    </p>
                  </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">
                        {[
                          customerData.customer.defaultAddress?.city,
                          customerData.customer.defaultAddress?.state,
                          customerData.customer.defaultAddress?.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "No default address"}
                      </p>
                    </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge
                      status={getCustomerStatusVariant(
                        customerData.customer.status,
                      )}
                    >
                      {customerData.customer.status}
                    </StatusBadge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {customerData.customer.totalOrders}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Orders
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {customerData.customer.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
                <h1 className="font-semibold text-xl">Recent Orders</h1>
                {customerData.customer.recentOrders?.length > 0 ? (
                  <div className="space-y-4">
                    {customerData.customer.recentOrders
                      .slice(0, 3)
                      .map((order) => (
                        <div
                          key={order._id}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium break-all">
                              Order ID: {order._id}
                            </p>
                            <p className="text-sm font-semibold">
                              {order.totalPrice}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {order.orderItems?.slice(0, 4).map((item) => (
                              <div
                                key={item._id}
                                className="grid grid-cols-6 gap-3 items-start"
                              >
                                <div className="col-span-5 min-w-0">
                                  <p className="text-sm text-muted-foreground break-all">
                                    Item ID: {item._id}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} x {item.price}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-right">
                                  {item.subtotal}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent orders found.
                  </p>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
