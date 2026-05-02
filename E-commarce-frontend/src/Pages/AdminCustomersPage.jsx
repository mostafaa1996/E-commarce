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
  SheetTrigger,
} from "@/components/adminUI/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";
import { Separator } from "@/components/adminUI/separator";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAdminCustomers,
  getAdminCustomer,
  updateAdminCustomerStatus,
} from "@/APIs/adminCustomersService";
import Loading from "@/components/genericComponents/Loading";
import { AlertCircle } from "lucide-react";
import useURLQuery from "@/hooks/UrlQuery";
import { shortenText } from "@/utils/utils";
import { queryClient } from "@/queryClient";

const defaultQuery = {
  status: "all",
  search: "",
  spent: "all",
  page: 1,
  limit: 10,
};

function isQueryChangedFromDefault(query) {
  return (
    query.status !== defaultQuery.status ||
    query.paymentStatus !== defaultQuery.paymentStatus ||
    query.search !== defaultQuery.search
  );
}

function getCustomerStatusVariant(status) {
  return status === "active"
    ? "success"
    : status === "inactive"
      ? "pending"
      : "danger";
}

export default function AdminCustomersPage() {
  let content = null;
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [spentarrangement, setSpentarrangement] = useState("all");
  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);
  console.log("MainQuery", MainQuery);
  console.log("spentarrangement", spentarrangement);
  const {
    data: customersData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["AdminCustomers", MainQuery],
    queryFn: () => getAdminCustomers(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    isFetching: isFetchingCustomer,
    error: errorCustomer,
  } = useQuery({
    queryKey: ["AdminCustomer", selectedCustomerId],
    queryFn: () => getAdminCustomer(selectedCustomerId),
    enabled: !!selectedCustomerId,
  });

  const { mutate: mutateCustomerStatus, isPending: isUpdatingCustomerStatus } =
    useMutation({
      mutationFn: ({ customerId, status }) =>
        updateAdminCustomerStatus(customerId, status),
      onMutate: async ({ customerId, status }) => {
        await queryClient.cancelQueries({ queryKey: ["AdminCustomers"] });
        await queryClient.cancelQueries({
          queryKey: ["AdminCustomer", customerId],
        });

        const previousCustomers = customers;
        const previousCustomer = queryClient.getQueryData([
          "AdminCustomer",
          customerId,
        ]);

        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === customerId || customer._id === customerId
              ? { ...customer, status }
              : customer,
          ),
        );

        queryClient.setQueryData(["AdminOrder", customerId], (old) =>
          old?.customer
            ? {
                ...old,
                customer: {
                  ...old.customer,
                  status,
                },
              }
            : old,
        );

        return { previousCustomers, previousCustomer, customerId };
      },
      onError: (error, { customerId }, context) => {
        if (context?.previousCustomers) {
          setCustomers(context.previousCustomers);
        }
        if (context?.previousCustomer) {
          queryClient.setQueryData(
            ["AdminCustomer", customerId],
            context.previousCustomer,
          );
        }
        toast({
          title: "Failed to update customer",
          description: error.message,
          variant: "destructive",
        });
      },
      onSuccess: (data, { customerId, status }) => {
        const updatedCustomer = data?.customer ?? data;

        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === customerId || customer._id === customerId
              ? { ...customer, ...updatedCustomer, status: updatedCustomer?.status ?? status }
              : customer,
          ),
        );

        queryClient.setQueryData(["AdminCustomer", customerId], (old) =>
          old?.customer
            ? {
                ...old,
                customer: {
                  ...old.customer,
                  ...updatedCustomer,
                  status: updatedCustomer?.status ?? status,
                },
              }
            : old,
        );

        toast({
          title:
            (updatedCustomer?.status ?? status) === "blocked"
              ? "Customer blocked"
              : "Customer unblocked",
          description: "Customer status has been updated.",
        });
      },
      onSettled: (_data, _error, { customerId }) => {
        queryClient.invalidateQueries({ queryKey: ["AdminCustomers"] });
        queryClient.invalidateQueries({ queryKey: ["AdminCustomer", customerId] });
      },
    });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [searchInput]);

  useEffect(() => {
    updateUrlQuery({
      search: searchTerm,
      status: selectedStatus,
      spent: spentarrangement,
      limit: 10,
    });
    queryClient.invalidateQueries(["AdminOrders", MainQuery]);
  }, [selectedStatus, searchTerm, spentarrangement]);

  useEffect(() => {
    if (customersData) {
      setCustomers(customersData.customers);
    }
  }, [customersData]);

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
                .map((n) => n[0])
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

  if (customersData && customers.length > 0) {
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
              placeholder="Search orders..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {isQueryChangedFromDefault(MainQuery) && (
            <AdminButton
              onClick={() => {
                resetUrlQuery(defaultQuery);
                setSearchInput("");
                setSearchTerm("");
                setSelectedStatus("all");
                setSpentarrangement("all");
              }}
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

        {/* Customer Detail Sheet */}
        <Sheet
          open={!!selectedCustomerId}
          onOpenChange={() => setSelectedCustomerId(null)}
        >
          <SheetContent className="w-[800px] sm:max-w-[800px]">
            <SheetHeader>
              <SheetTitle>Customer Details</SheetTitle>
              <SheetDescription>View customer information</SheetDescription>
            </SheetHeader>
            {isLoadingCustomer && isFetchingCustomer && (
              <Loading message="Loading customer" />
            )}
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
            {customerData && customerData?.customer && (
              <div className="mt-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                        {customerData?.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {customerData?.customer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Member since {customerData?.customer.createdAt}
                      </p>
                    </div>
                  </div>
                  <AdminButton
                    variant={
                      customerData?.customer.status === "blocked"
                        ? "outline"
                        : "destructive"
                    }
                    size="sm"
                    disabled={isUpdatingCustomerStatus}
                    onClick={() =>
                      mutateCustomerStatus({
                        customerId:
                          customerData?.customer.id || customerData?.customer._id,
                        status:
                          customerData?.customer.status === "blocked"
                            ? "active"
                            : "blocked",
                      })
                    }
                  >
                    {isUpdatingCustomerStatus
                      ? "Updating..."
                      : customerData?.customer.status === "blocked"
                        ? "Unblock User"
                        : "Block User"}
                  </AdminButton>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">
                      {shortenText(customerData?.customer.email, 20)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">
                      {customerData?.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">
                      {customerData?.customer.defaultAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge
                      status={getCustomerStatusVariant(customerData?.customer.status)}
                    >
                      {customerData?.customer.status}
                    </StatusBadge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {customerData?.customer.totalOrders}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Orders
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {customerData?.customer.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
                <h1 className="font-semibold text-xl">Recent Orders</h1>
                {customerData?.customer.recentOrders?.length > 0 ? (
                  <div className="space-y-4">
                    {customerData.customer.recentOrders.slice(0, 3).map((order) => (
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
