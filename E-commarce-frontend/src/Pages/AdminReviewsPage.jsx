import { Star, Check, X, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";

const reviews = [
  { product: "ECOPAD 10.1\" Tablet", customer: "Ahmed Hassan", rating: 5, comment: "Excellent tablet for the price! Great performance and battery life.", date: "Mar 15, 2026", status: "Approved" },
  { product: "ZZA 32\" 4K Monitor", customer: "Sara Ali", rating: 4, comment: "Beautiful display, great colors. Slightly slow response time for gaming.", date: "Mar 14, 2026", status: "Approved" },
  { product: "Smart Watch Pro", customer: "Mohamed Nour", rating: 2, comment: "Battery life is disappointing. Only lasts 1 day with normal use.", date: "Mar 13, 2026", status: "Pending" },
  { product: "Wireless Earbuds X3", customer: "Fatma Ibrahim", rating: 5, comment: "Best earbuds in this price range! Amazing sound quality.", date: "Mar 12, 2026", status: "Approved" },
  { product: "USB-C Hub Adapter", customer: "Omar Khaled", rating: 1, comment: "Stopped working after 2 weeks. Very poor quality.", date: "Mar 11, 2026", status: "Rejected" },
  { product: "Laptop Stand Pro", customer: "Laila Youssef", rating: 4, comment: "Sturdy and well-built. Good for ergonomic setup.", date: "Mar 10, 2026", status: "Pending" },
];

const statusMap= {
  Approved: "success", Pending: "warning", Rejected: "danger",
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const columns = [
    { key: "product", header: "Product", render: (item) => <span className="font-medium text-foreground">{item.product}</span> },
    { key: "customer", header: "Customer" },
    { key: "rating", header: "Rating", render: (item) => <StarRating rating={item.rating} /> },
    { key: "comment", header: "Comment", render: (item) => <p className="text-sm text-muted-foreground max-w-[250px] truncate">{item.comment}</p>, className: "max-w-[300px]" },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={statusMap[item.status]}>{item.status}</StatusBadge> },
    {
      key: "actions", header: "",
      render: (item) => (
        <div className="flex gap-1">
          {item.status === "Pending" && (
            <>
              <AdminButton variant="ghost" size="icon" className="h-8 w-8 text-success"><Check className="h-4 w-4" /></AdminButton>
              <AdminButton variant="ghost" size="icon" className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></AdminButton>
            </>
          )}
          <AdminButton variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></AdminButton>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Reviews"
        description="Moderate customer reviews"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Reviews" }]}
      />
      <DataTable columns={columns} data={reviews} page={1} totalPages={2} />
    </AdminLayout>
  );
}