import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/adminUI/AdminButton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/adminUI/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/adminUI/alert-dialog";
import  InputField  from "@/components/genericComponents/InputField";
import { Label } from "@/components/genericComponents/Label";
import  Textarea from "@/components/genericComponents/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const initialCategories = [
  { name: "Tablets", slug: "tablets", products: 24, icon: "📱", description: "Tablets and e-readers" },
  { name: "Monitors", slug: "monitors", products: 18, icon: "🖥️", description: "Computer monitors and displays" },
  { name: "Wearables", slug: "wearables", products: 32, icon: "⌚", description: "Smart watches and fitness trackers" },
  { name: "Audio", slug: "audio", products: 45, icon: "🎧", description: "Headphones, speakers, and audio equipment" },
  { name: "Storage", slug: "storage", products: 15, icon: "💾", description: "Hard drives, SSDs, and memory cards" },
  { name: "Accessories", slug: "accessories", products: 67, icon: "🔌", description: "Cables, adapters, and peripherals" },
  { name: "Peripherals", slug: "peripherals", products: 38, icon: "⌨️", description: "Keyboards, mice, and input devices" },
  { name: "Networking", slug: "networking", products: 12, icon: "📡", description: "Routers, switches, and networking equipment" },
];

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "", description: "" });
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setEditForm({ name: cat.name, slug: cat.slug, description: cat.description });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.slug === editingCategory.slug
          ? { ...c, name: editForm.name, slug: editForm.slug, description: editForm.description }
          : c
      )
    );
    setEditOpen(false);
    toast({ title: "Category updated", description: `"${editForm.name}" has been updated.` });
  };

  const handleDelete = (slug) => {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    toast({ title: "Category deleted", description: "The category has been removed.", variant: "destructive" });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Categories"
        description="Organize your products into categories"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Categories" }]}
        actions={
          <Dialog>
            <DialogTrigger asChild><AdminButton><Plus className="h-4 w-4 mr-2" />Add Category</AdminButton></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>Create a new product category.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Category Name</Label><InputField placeholder="e.g. Electronics" /></div>
                <div className="space-y-2"><Label>Slug</Label><InputField placeholder="electronics" /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Category description..." /></div>
                <div className="space-y-2">
                  <Label>Icon / Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground text-sm">
                    Drag & drop or click to upload
                  </div>
                </div>
              </div>
              <DialogFooter>
                <AdminButton variant="outline">Cancel</AdminButton>
                <AdminButton>Save Category</AdminButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.slug} className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{cat.icon}</span>
              <div className="flex gap-1">
                <AdminButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => handleEdit(cat)}
                >
                  <Edit className="h-4 w-4" />
                </AdminButton>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <AdminButton
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </AdminButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{cat.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove this category and unlink {cat.products} products. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(cat.slug)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{cat.description}</p>
            <p className="text-sm font-medium text-primary">{cat.products} products</p>
          </div>
        ))}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <InputField value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <InputField value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Icon / Image</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground text-sm">
                Drag & drop or click to upload
              </div>
            </div>
          </div>
          <DialogFooter>
            <AdminButton variant="outline" onClick={() => setEditOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSaveEdit}>Save Changes</AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}