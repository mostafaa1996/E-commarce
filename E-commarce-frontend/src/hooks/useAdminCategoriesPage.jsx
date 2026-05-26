import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/APIs/adminCategories";
import { queryClient } from "@/queryClient";
import { useToast } from "@/hooks/use-toast";

const emptyCategoryForm = {
  name: "",
  keywords: "",
  parent: "",
  icon: "",
  isActive: false,
};

function createCategoryFormData(form) {
  const category = new FormData();

  category.append("name", form.name);
  category.append("keywords", form.keywords);
  category.append("parent", form.parent || "");
  category.append("isActive", form.isActive);

  if (form.icon) {
    category.append("icon", form.icon);
  }

  return category;
}

function getCategoryRelationLabel(relation) {
  if (!relation) return null;
  if (typeof relation === "string") return relation;
  return relation.name || null;
}

export default function useAdminCategoriesPage() {
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState(emptyCategoryForm);
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

  const createCategoryMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "The category has been added.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
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

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, category }) => updateAdminCategory(id, category),
    onSuccess: () => {
      toast({
        title: "Category updated",
        description: "The category has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      setEditOpen(false);
    },
    onError: () => {
      toast({
        title: "Failed to update category",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been removed.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: () => {
      toast({
        title: "Failed to delete category",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = async (form) => {
    await createCategoryMutation.mutateAsync(createCategoryFormData(form));
  };

  const handleEdit = (category) => {
    if (!category) return;

    setEditingCategory(category);
    setEditForm({
      name: category.name,
      keywords: category.keywords || "",
      parent: category.parent || "",
      icon: category.icon?.icon || "",
      isActive: category.isActive ?? false,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async (formValues) => {
    if (!editingCategory) return;

    await updateCategoryMutation.mutateAsync({
      id: editingCategory.id,
      category: createCategoryFormData(formValues),
    });
    setEditForm(formValues);
  };

  const handleDelete = (id) => {
    deleteCategoryMutation.mutate(id);
  };

  return {
    categories: categoriesData || [],
    categoriesData,
    isLoading,
    isFetching,
    isError,
    error,
    editingCategory,
    editForm,
    createOpen,
    editOpen,
    setCreateOpen,
    setEditOpen,
    handleCreate,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    getCategoryRelationLabel,
  };
}
