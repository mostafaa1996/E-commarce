import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/adminUI/AdminButton";
import  InputField  from "@/components/genericComponents/InputField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/adminUI/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/adminUI/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/adminUI/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/adminUI/alert-dialog";
import { Label } from "@/components/genericComponents/Label";
import  Textarea  from "@/components/genericComponents/textarea";
import { Switch } from "@/components/adminUI/switch";
import { Separator } from "@/components/adminUI/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const initialProducts = [
  { id: 1, name: 'ECOPAD 10.1" Tablet', category: "Tablets", price: "$59.99", stock: 142, status: "Active", date: "Mar 10, 2026", image: "📱", sku: "SKU-0001", description: "Affordable 10.1 inch tablet with long battery life." },
  { id: 2, name: 'ZZA 32" 4K Monitor', category: "Monitors", price: "$169.99", stock: 28, status: "Active", date: "Mar 08, 2026", image: "🖥️", sku: "SKU-0002", description: "Ultra-sharp 4K display for professionals." },
  { id: 3, name: "Smart Watch Pro", category: "Wearables", price: "$149.99", stock: 5, status: "Active", date: "Mar 05, 2026", image: "⌚", sku: "SKU-0003", description: "Feature-packed smartwatch with health tracking." },
  { id: 4, name: "Wireless Earbuds X3", category: "Audio", price: "$39.99", stock: 0, status: "Draft", date: "Mar 03, 2026", image: "🎧", sku: "SKU-0004", description: "True wireless earbuds with noise cancellation." },
  { id: 5, name: "Seagate HDD 1TB", category: "Storage", price: "$59.99", stock: 65, status: "Active", date: "Mar 01, 2026", image: "💾", sku: "SKU-0005", description: "Reliable 1TB external hard drive." },
  { id: 6, name: "USB-C Hub Adapter", category: "Accessories", price: "$29.99", stock: 3, status: "Active", date: "Feb 28, 2026", image: "🔌", sku: "SKU-0006", description: "Multi-port USB-C hub with HDMI output." },
  { id: 7, name: "Laptop Stand Pro", category: "Accessories", price: "$44.99", stock: 12, status: "Active", date: "Feb 25, 2026", image: "💻", sku: "SKU-0007", description: "Ergonomic adjustable laptop stand." },
  { id: 8, name: "Mechanical Keyboard", category: "Peripherals", price: "$89.99", stock: 0, status: "Draft", date: "Feb 20, 2026", image: "⌨️", sku: "SKU-0008", description: "RGB mechanical keyboard with Cherry MX switches." },
];



export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({ name: "", category: "", price: "", stock: 0, status: "Active", description: "" });

  const openEdit = (p) => {
    setEditProduct(p);
    setEditForm({ name: p.name, category: p.category, price: p.price.replace("$", ""), stock: p.stock, status: p.status, description: p.description });
  };

  const handleSaveEdit = () => {
    if (!editProduct) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProduct.id
          ? { ...p, name: editForm.name, category: editForm.category, price: `$${editForm.price}`, stock: editForm.stock, status: editForm.status, description: editForm.description }
          : p
      )
    );
    setEditProduct(null);
    toast({ title: "Product updated", description: `"${editForm.name}" has been saved.` });
  };

  const handleDelete = () => {
    if (!deleteProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    toast({ title: "Product deleted", description: `"${deleteProduct.name}" has been removed.`, variant: "destructive" });
    setDeleteProduct(null);
  };

  const columns = [
    {
      key: "name", header: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{item.image}</span>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category" },
    { key: "price", header: "Price", render: (item) => <span className="font-semibold">{item.price}</span> },
    {
      key: "stock", header: "Stock",
      render: (item) => (
        <StatusBadge status={item.stock === 0 ? "danger" : item.stock < 10 ? "warning" : "success"}>
          {item.stock === 0 ? "Out of stock" : `${item.stock} units`}
        </StatusBadge>
      ),
    },
    {
      key: "status", header: "Status",
      render: (item) => (
        <StatusBadge status={item.status === "Active" ? "success" : "pending"}>{item.status}</StatusBadge>
      ),
    },
    { key: "date", header: "Created" },
    {
      key: "actions", header: "",
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AdminButton variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></AdminButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewProduct(item)}>
              <Eye className="h-4 w-4 mr-2" />View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEdit(item)}>
              <Edit className="h-4 w-4 mr-2" />Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteProduct(item)}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Products" }]}
        actions={
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <AdminButton><Plus className="h-4 w-4 mr-2" />Add Product</AdminButton>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Fill in the product details below.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2"><Label>Product Name</Label><InputField placeholder="e.g. Smart Watch Pro" /></div>
                <div className="space-y-2"><Label>Slug</Label><InputField placeholder="smart-watch-pro" /></div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tablets">Tablets</SelectItem>
                      <SelectItem value="monitors">Monitors</SelectItem>
                      <SelectItem value="wearables">Wearables</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>SKU</Label><InputField placeholder="SKU-0001" /></div>
                <div className="space-y-2"><Label>Price</Label><InputField type="number" placeholder="0.00" /></div>
                <div className="space-y-2"><Label>Discount Price</Label><InputField type="number" placeholder="0.00" /></div>
                <div className="space-y-2"><Label>Stock Quantity</Label><InputField type="number" placeholder="0" /></div>
                <div className="space-y-2 flex items-end gap-3">
                  <div className="flex items-center gap-2"><Switch id="active" /><Label htmlFor="active">Active</Label></div>
                </div>
                <div className="col-span-full space-y-2"><Label>Short Description</Label><InputField placeholder="Brief product description" /></div>
                <div className="col-span-full space-y-2"><Label>Full Description</Label><Textarea placeholder="Detailed product description..." rows={4} /></div>
                <div className="col-span-full space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    <p className="text-sm">Drag & drop images here, or click to browse</p>
                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <AdminButton variant="outline" onClick={() => setShowForm(false)}>Cancel</AdminButton>
                <AdminButton onClick={() => setShowForm(false)}>Save Product</AdminButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <InputField placeholder="Search products..." className="pl-9" />
        </div>
        <Select><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="tablets">Tablets</SelectItem>
            <SelectItem value="monitors">Monitors</SelectItem>
            <SelectItem value="wearables">Wearables</SelectItem>
          </SelectContent>
        </Select>
        <Select><SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={products} page={1} totalPages={3} />

      {/* View Product Dialog */}
      <Dialog open={!!viewProduct} onOpenChange={(open) => !open && setViewProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>View product information.</DialogDescription>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{viewProduct.image}</span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{viewProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewProduct.sku}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{viewProduct.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium text-foreground">{viewProduct.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <StatusBadge status={viewProduct.stock === 0 ? "danger" : viewProduct.stock < 10 ? "warning" : "success"}>
                    {viewProduct.stock === 0 ? "Out of stock" : `${viewProduct.stock} units`}
                  </StatusBadge>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={viewProduct.status === "Active" ? "success" : "pending"}>{viewProduct.status}</StatusBadge>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">{viewProduct.date}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground">{viewProduct.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <AdminButton variant="outline" onClick={() => setViewProduct(null)}>Close</AdminButton>
            <AdminButton onClick={() => { if (viewProduct) { openEdit(viewProduct); setViewProduct(null); } }}>
              <Edit className="h-4 w-4 mr-2" />Edit Product
            </AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <InputField value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editForm.category.toLowerCase()} onValueChange={(v) => setEditForm({ ...editForm, category: v.charAt(0).toUpperCase() + v.slice(1) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="monitors">Monitors</SelectItem>
                  <SelectItem value="wearables">Wearables</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="peripherals">Peripherals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <InputField type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <InputField type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })} />
            </div>
            <div className="space-y-2 flex items-end gap-3">
              <div className="flex items-center gap-2">
                <Switch checked={editForm.status === "Active"} onCheckedChange={(c) => setEditForm({ ...editForm, status: c ? "Active" : "Draft" })} />
                <Label>{editForm.status}</Label>
              </div>
            </div>
            <div />
            <div className="col-span-full space-y-2">
              <Label>Description</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <AdminButton variant="outline" onClick={() => setEditProduct(null)}>Cancel</AdminButton>
            <AdminButton onClick={handleSaveEdit}>Save Changes</AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteProduct?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this product from your catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
