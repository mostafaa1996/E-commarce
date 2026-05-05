import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatCard } from "@/components/admin/StatCard";
import { AdminButton } from "@/components/adminUI/AdminButton";
import InputField from "@/components/genericComponents/InputField";
import { shortenText } from "@/utils/utils";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAdminInventory,
  updateAdminInventory,
} from "@/APIs/adminInventoryService";
import Loading from "@/components/genericComponents/Loading";
import { AlertCircle } from "lucide-react";
import useURLQuery from "@/hooks/UrlQuery";

const defaultQuery = {
  page: 1,
  limit: 10,
};

const statusMap = {
  "In Stock": "success",
  Low: "warning",
  Critical: "danger",
  "Out of Stock": "danger",
};

export default function AdminInventoryPage() {
  let content = null;
  const { toast } = useToast();
  const { MainQuery, updateUrlQuery } = useURLQuery(defaultQuery);
  const [InventoryData, setInventoryData] = useState(null);
  const [stock, setStock] = useState({});
  const [lowStockThreshold, setLowStockThreshold] = useState({});
  const [criticalStockThreshold, setCriticalStockThreshold] = useState({});
  const [updatingKey, setUpdatingKey] = useState(null);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["adminInventory", MainQuery],
    queryFn: () => getAdminInventory(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const { mutateAsync: updateInventory } = useMutation({
    mutationFn: ({ id, variantId, intent }) =>
      updateAdminInventory({ id, variantId, intent }),
    onSuccess: () => {
      console.log("Inventory updated successfully");
      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });
      setUpdatingKey(null);
    },
  });

  useEffect(() => {
    if (data && !InventoryData) {
      setInventoryData(data);
    }
  }, [data, InventoryData]);

  if ((isLoading || isFetching) && !InventoryData) {
    content = <Loading message="Loading Inventory Data" fullPage />;
  }

  if (error && isError && !InventoryData) {
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

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">
            {shortenText(item.title, 30)}
          </p>
          <p className="text-xs text-muted-foreground">{item.sku}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <p className="text-xs text-muted-foreground">{item.category}</p>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (item) => (
        <div className="flex items-center gap-2">
          <InputField
            type="number"
            value={stock[item.sku] || item.stock}
            className="w-20 h-8 text-center"
            onChange={(e) => setStock({ ...stock, [item.sku]: e.target.value })}
          />
          <AdminButton
            onClick={() => {
              const key = `${item.sku}-${item.stock}-Stock`;
              setUpdatingKey(key);
              updateInventory({
                id: item._id,
                variantId: item.variantId,
                intent: {
                  stock: parseInt(stock[item.sku] || item.stock),
                  lowStockThreshold: null,
                  criticalStockThreshold: null,
                },
              });
            }}
            variant="outline"
            size="sm"
            className={`h-8 ${
              updatingKey === `${item.sku}-${item.stock}-Stock` &&
              "pointer-events-none"
            }`}
            disabled={updatingKey === `${item.sku}-${item.stock}-Stock`}
          >
            {updatingKey === `${item.sku}-${item.stock}-Stock`
              ? "Updating..."
              : "Update"}
          </AdminButton>
        </div>
      ),
    },
    {
      key: "configure Low Stock Alert",
      header: "Low Stock Alert",
      render: (item) => (
        <div className="flex items-center gap-2">
          <InputField
            type="number"
            className="w-20 h-8 text-center"
            value={lowStockThreshold[item.sku] || item.lowStockThreshold}
            onChange={(e) =>
              setLowStockThreshold({
                ...lowStockThreshold,
                [item.sku]: e.target.value,
              })
            }
          />
          <AdminButton
            onClick={() => {
              setUpdatingKey(`${item.sku}-${item.lowStockThreshold}-lowStock`);
              updateInventory({
                id: item._id,
                variantId: item.variantId,
                intent: {
                  stock: null,
                  lowStockThreshold: parseInt(
                    lowStockThreshold[item.sku] || item.lowStockThreshold,
                  ),
                  criticalStockThreshold: null,
                },
              });
            }}
            variant="outline"
            size="sm"
            className={`h-8 ${
              updatingKey === `${item.sku}-${item.lowStockThreshold}-lowStock` &&
              "pointer-events-none"
            }`}
            disabled={updatingKey === `${item.sku}-${item.lowStockThreshold}-lowStock`}
          >
            {updatingKey === `${item.sku}-${item.lowStockThreshold}-lowStock`
              ? "Updating..."
              : "Update"}
          </AdminButton>
        </div>
      ),
    },
    {
      key: "configure Critical Stock Alert",
      header: "Critical Stock Alert",
      render: (item) => (
        <div className="flex items-center gap-2">
          <InputField
            type="number"
            className="w-20 h-8 text-center"
            value={
              criticalStockThreshold[item.sku] || item.criticalStockThreshold
            }
            onChange={(e) =>
              setCriticalStockThreshold({
                ...criticalStockThreshold,
                [item.sku]: e.target.value,
              })
            }
          />
          <AdminButton
            key={item._id}
            onClick={() => {
              setUpdatingKey(`${item.sku}-${item.criticalStockThreshold}-criticalStock`);
              updateInventory({
                id: item._id,
                variantId: item.variantId,
                intent: {
                  stock: null,
                  lowStockThreshold: null,
                  criticalStockThreshold: parseInt(
                    criticalStockThreshold[item.sku] ||
                      item.criticalStockThreshold,
                  ),
                },
              });
            }}
            variant="outline"
            size="sm"
            className={`h-8 ${updatingKey === `${item.sku}-${item.criticalStockThreshold}-criticalStock` && "pointer-events-none"}`}
            disabled={updatingKey === `${item.sku}-${item.criticalStockThreshold}-criticalStock`}
          >
            {updatingKey === `${item.sku}-${item.criticalStockThreshold}-criticalStock` ? "Updating..." : "Update"}
          </AdminButton>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={statusMap[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (item) => (
        <p className="text-sm text-muted-foreground">{item.updatedAt}</p>
      ),
    },
  ];

  if (InventoryData) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Inventory"
          description="Monitor and manage stock levels"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Inventory" },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Products"
            value={InventoryData?.productsCount || 0}
            iconName={"package"}
          />
          <StatCard
            title="In Stock"
            value={InventoryData?.InStockCount || 0}
            iconName={"package"}
            iconBg="bg-success/10"
          />
          <StatCard
            title="Low Stock"
            value={InventoryData?.LowStockCount || 0}
            change="Needs attention"
            changeType="down"
            iconName={"alertTriangle"}
            iconBg="bg-warning/10"
          />
          <StatCard
            title="Critical Stock"
            value={InventoryData?.CriticalStockCount || 0}
            change="Restock needed"
            changeType="down"
            iconName={"alertTriangle"}
            iconBg="bg-destructive/10"
          />
          <StatCard
            title="Out of Stock"
            value={InventoryData?.OutOfStockCount || 0}
            change="Restock needed"
            changeType="down"
            iconName={"alertTriangle"}
            iconBg="bg-destructive/10"
          />
        </div>

        <DataTable
          columns={columns}
          data={InventoryData?.Inventory || []}
          page={InventoryData?.pagination?.page || 1}
          totalPages={InventoryData?.pagination?.totalPages || 1}
          onPageChange={(page) => updateUrlQuery({ page })}
        />
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
