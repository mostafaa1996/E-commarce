import Icon from "@/system/icons/Icon";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import CategoryDialog from "@/components/adminUI/CategoryDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/adminUI/alert-dialog";
import Loading from "@/components/genericComponents/Loading";
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/APIs/adminCategories";

import { useQuery, useMutation } from "@tanstack/react-query";

export default function AdminCategoriesPage() {
  let content = null;
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    keywords: "",
    parent: "",
    icon: "",
    isActive: false,
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: categoriesData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: getAdminCategories,
  });

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: (data) => {
      const createdCategory = data?.category ?? data;
      if (!createdCategory) return;
      setCategories((prev) => [...prev, createdCategory]);
      toast({
        title: "Category created",
        description: "The category has been added.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to create category",
        description: "Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setCreateOpen(false);
    },
  });
  const { mutateAsync: updateCategory } = useMutation({
    mutationFn: ({ id, category }) => updateAdminCategory(id, category),
    onError: (_error, _id, context) => {
      if (context?.prevCategories) {
        setCategories(context.prevCategories);
        setEditOpen(false);
        toast({
          title: "Failed to update category",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      const updatedCategory = data?.category ?? data;
      console.log(updatedCategory);
      toast({
        title: "Category updated",
        description: "The category has been updated.",
      });
      setCategories((prev) =>
        prev.map((c) =>
          c.id === updatedCategory.id
            ? {
                ...c,
                ...updatedCategory,
              }
            : c,
        ),
      );
      setEditOpen(false);
    },
  });
  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: deleteAdminCategory,
    onMutate: async (id) => {
      const prevCategories = categories;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { prevCategories };
    },
    onError: (_error, _id, context) => {
      if (context?.prevCategories) {
        setCategories(context.prevCategories);
      }
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been removed.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (categoriesData && categories.length === 0) {
      setCategories(categoriesData);
    }
  }, [categoriesData, categories.length]);

  const handleCreate = async (form) => {
    const category = new FormData();

    category.append("name", form.name);
    category.append("keywords", form.keywords);
    category.append("parent", form.parent || "");
    category.append("isActive", form.isActive);
    category.append("icon", form.icon); // this is the File object

    await createCategory(category);
  };

  const handleEdit = (cat) => {
    if (!cat) return;
    setEditingCategory(cat);
    setEditForm({
      name: cat.name,
      keywords: cat.keywords || "",
      parent: cat.parent || "",
      icon: cat.icon.icon || "",
      isActive: cat.isActive ?? false,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async (formValues) => {
    if (!editingCategory) return;
    const category = new FormData();
    category.append("name", formValues.name);
    category.append("keywords", formValues.keywords);
    category.append("parent", formValues.parent || "");
    category.append("isActive", formValues.isActive);
    if (formValues.icon instanceof File) {
      category.append("icon", formValues.icon);
    }
    await updateCategory({
      id: editingCategory.id,
      category: category,
    });
    setEditForm(formValues);
    setEditOpen(false);
  };

  const handleDelete = (id) => {
    deleteCategory(id);
  };

  const getCategoryRelationLabel = (relation) => {
    if (!relation) return null;
    if (typeof relation === "string") return relation;
    return relation.name || null;
  };

  if ((isLoading || isFetching) && !categoriesData) {
    content = <Loading message="Loading categories" fullPage />;
  }

  if (isError && !categoriesData) {
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

  if (categoriesData && categories.length !== 0) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Categories"
          description="Organize your products into categories"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Categories" },
          ]}
          actions={
            <>
              <AdminButton onClick={() => setCreateOpen(true)}>
                <Icon name="plus" className="h-4 w-4 mr-2 text-white" />
                Add Category
              </AdminButton>
              <CategoryDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                title="Add Category"
                description="Create a new product category."
                submitLabel="Save Category"
                categories={categories}
                onSubmit={handleCreate}
              />
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">
                  <img src={cat.icon.icon} className="h-10 w-10" />
                </span>
                <div className="flex gap-1">
                  <AdminButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => handleEdit(cat)}
                  >
                    <Icon name="edit" className="h-4 w-4" />
                  </AdminButton>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <AdminButton
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="trash2" className="h-4 w-4" />
                      </AdminButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete "{cat.name}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove this category so make
                          sure that no products are in it. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {cat.keywords}
              </p>
              <p className="text-sm font-medium text-primary">
                {cat.attachedProductsCount} products
              </p>
              {(() => {
                const parentLabel = getCategoryRelationLabel(cat.parent);
                const ancestorLabels = Array.isArray(cat.ancestors)
                  ? cat.ancestors.map(getCategoryRelationLabel).filter(Boolean)
                  : [];

                if (!parentLabel && ancestorLabels.length === 0) return null;

                return (
                  <div className="mt-3 border-t border-border/60 pt-3 space-y-2">
                    {parentLabel && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          Parent:
                        </span>{" "}
                        {parentLabel}
                      </p>
                    )}
                    {ancestorLabels.length > 0 && (
                      <p className="text-xs text-muted-foreground break-words">
                        <span className="font-medium text-foreground/80">
                          Ancestors:
                        </span>{" "}
                        {ancestorLabels.join(" / ")}
                      </p>
                    )}
                  </div>
                );
              })()}
              <div className="mt-3">
                <StatusBadge status={cat.isActive ? "success" : "pending"}>
                  {cat.isActive ? "Active" : "Inactive"}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>

        <CategoryDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit Category"
          description="Update the category details."
          submitLabel="Save Changes"
          categories={categories}
          initialValues={editForm}
          excludeCategoryId={editingCategory?._id || editingCategory?.id}
          onSubmit={handleSaveEdit}
        />
      </AdminLayout>
    );
  }

  return <>{content}</>;
}
