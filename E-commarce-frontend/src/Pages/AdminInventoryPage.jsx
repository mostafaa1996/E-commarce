import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatCard } from "@/components/admin/StatCard";
import { AdminButton } from "@/components/adminUI/AdminButton";
import InputField from "@/components/genericComponents/InputField";
import { shortenText } from "@/utils/utils";
import Loading from "@/components/genericComponents/Loading";
import { AlertCircle } from "lucide-react";
import useAdminInventoryPage from "@/hooks/useAdminInventoryPage";

const statusMap = {
  "In Stock": "success",
  Low: "warning",
  Critical: "danger",
  "Out of Stock": "danger",
};

export default function AdminInventoryPage() {
  let content = null;
  const {
    inventoryData,
    isLoading,
    isFetching,
    isError,
    error,
    stock,
    lowStockThreshold,
    criticalStockThreshold,
    updatingKey,
    setUpdatingKey,
    updateInventory,
    updateStockDraft,
    updateLowStockThresholdDraft,
    updateCriticalStockThresholdDraft,
    updateUrlQuery,
  } = useAdminInventoryPage();

  if ((isLoading || isFetching) && !inventoryData) {
    content = <Loading message="Loading Inventory Data" fullPage />;
  }

  if (error && isError && !inventoryData) {
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
            onChange={(e) => updateStockDraft(item.sku, e.target.value)}
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
              updateLowStockThresholdDraft(item.sku, e.target.value)
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
              updateCriticalStockThresholdDraft(item.sku, e.target.value)
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

  if (inventoryData) {
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
            value={inventoryData?.productsCount || 0}
            iconName={"package"}
          />
          <StatCard
            title="In Stock"
            value={inventoryData?.InStockCount || 0}
            iconName={"package"}
            iconBg="bg-success/10"
          />
          <StatCard
            title="Low Stock"
            value={inventoryData?.LowStockCount || 0}
            change="Needs attention"
            changeType="down"
            iconName={"alertTriangle"}
            iconBg="bg-warning/10"
          />
          <StatCard
            title="Critical Stock"
            value={inventoryData?.CriticalStockCount || 0}
            change="Restock needed"
            changeType="down"
            iconName={"alertTriangle"}
            iconBg="bg-destructive/10"
          />
          <StatCard
            title="Out of Stock"
            value={inventoryData?.OutOfStockCount || 0}
            change="Restock needed"
            changeType="down"
            iconName={"alertTriangle"}
            iconBg="bg-destructive/10"
          />
        </div>

        <DataTable
          columns={columns}
          data={inventoryData?.Inventory || []}
          page={inventoryData?.pagination?.page || 1}
          totalPages={inventoryData?.pagination?.totalPages || 1}
          onPageChange={(page) => updateUrlQuery({ page })}
        />
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
