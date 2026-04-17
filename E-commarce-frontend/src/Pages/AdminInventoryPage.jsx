import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatCard } from "@/components/admin/StatCard";
import { AdminButton } from "@/components/adminUI/AdminButton";
import  InputField  from "@/components/genericComponents/InputField";

const inventory = [
  { name: "USB-C Hub Adapter", sku: "SKU-0006", category: "Accessories", stock: 3, status: "Critical", lastUpdated: "Mar 15, 2026" },
  { name: "HDMI Cable 2m", sku: "SKU-0012", category: "Accessories", stock: 2, status: "Critical", lastUpdated: "Mar 14, 2026" },
  { name: "Smart Watch Pro", sku: "SKU-0003", category: "Wearables", stock: 5, status: "Low", lastUpdated: "Mar 13, 2026" },
  { name: "Laptop Stand Pro", sku: "SKU-0007", category: "Accessories", stock: 8, status: "Low", lastUpdated: "Mar 12, 2026" },
  { name: "Wireless Earbuds X3", sku: "SKU-0004", category: "Audio", stock: 0, status: "Out of Stock", lastUpdated: "Mar 11, 2026" },
  { name: "Mechanical Keyboard", sku: "SKU-0008", category: "Peripherals", stock: 0, status: "Out of Stock", lastUpdated: "Mar 10, 2026" },
  { name: "ZZA 32\" 4K Monitor", sku: "SKU-0002", category: "Monitors", stock: 28, status: "In Stock", lastUpdated: "Mar 09, 2026" },
  { name: "ECOPAD Tablet", sku: "SKU-0001", category: "Tablets", stock: 142, status: "In Stock", lastUpdated: "Mar 08, 2026" },
];

const statusMap= {
  "In Stock": "success", Low: "warning", Critical: "danger", "Out of Stock": "danger",
};

export default function AdminInventoryPage() {
  const columns = [
    { key: "name", header: "Product", render: (item) => <div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.sku}</p></div> },
    { key: "category", header: "Category" },
    {
      key: "stock", header: "Stock",
      render: (item) => (
        <div className="flex items-center gap-2">
          <InputField type="number" defaultValue={item.stock} className="w-20 h-8 text-center" />
          <AdminButton variant="outline" size="sm" className="h-8">Update</AdminButton>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={statusMap[item.status]}>{item.status}</StatusBadge> },
    { key: "lastUpdated", header: "Last Updated" },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Inventory"
        description="Monitor and manage stock levels"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Inventory" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Products" value="456" iconName={"package"} />
        <StatCard title="In Stock" value="398" iconName={"package"} iconBg="bg-success/10" />
        <StatCard title="Low Stock" value="12" change="Needs attention" changeType="down" iconName={"alertTriangle"} iconBg="bg-warning/10" />
        <StatCard title="Out of Stock" value="8" change="Restock needed" changeType="down" iconName={"alertTriangle"} iconBg="bg-destructive/10" />
      </div>

      <DataTable columns={columns} data={inventory} page={1} totalPages={2} />
    </AdminLayout>
  );
}