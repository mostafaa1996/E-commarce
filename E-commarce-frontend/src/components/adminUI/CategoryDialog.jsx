import { useEffect, useMemo, useRef, useState } from "react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/adminUI/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";
import InputField from "@/components/genericComponents/InputField";
import { Label } from "@/components/genericComponents/Label";
import Textarea from "@/components/genericComponents/textarea";

const EMPTY_FORM = {
  name: "",
  keywords: "",
  parent: "",
  icon: "",
  isActive: false,
};

const getCategoryOptionValue = (category) =>
  category?._id || category?.id  || "";

const getCategoryOptionLabel = (category) =>
  category?.name  || "Unnamed category";

const normalizeParentValue = (parent) => {
  if (!parent) return "";
  if (typeof parent === "string") return parent;
  return parent._id || parent.id || "";
};

export default function CategoryDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  onSubmit,
  categories = [],
  initialValues,
  excludeCategoryId,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fileName, setFileName] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: initialValues?.name || "",
      keywords: initialValues?.keywords || "",
      parent: normalizeParentValue(initialValues?.parent),
      icon: initialValues?.icon || "",
      isActive: initialValues?.isActive ?? false,
    });
    setIconPreview(initialValues?.icon || "");
    setFileName("");
  }, [initialValues, open]);

  const parentOptions = useMemo(
    () =>
      categories.filter(
        (category) => getCategoryOptionValue(category) !== excludeCategoryId,
      ),
    [categories, excludeCategoryId],
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadImageFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        icon: file,
      }));
      setIconPreview(typeof reader.result === "string" ? reader.result : "");
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    loadImageFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    loadImageFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <InputField
              placeholder="e.g. Electronics"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Keywords</Label>
            <Textarea
              placeholder="e.g. phones, laptops, accessories"
              value={form.keywords}
              onChange={(event) => updateField("keywords", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Parent Category</Label>
            <Select
              value={form.parent || "none"}
              onValueChange={(value) =>
                updateField("parent", value === "none" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent category</SelectItem>
                {parentOptions.map((category) => {
                  const value = getCategoryOptionValue(category);
                  return (
                    <SelectItem key={value} value={value}>
                      {getCategoryOptionLabel(category)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField("isActive", event.target.checked)
              }
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Active</p>
              <p className="text-xs text-muted-foreground">
                Enable this category for use in the store.
              </p>
            </div>
          </label>

          <div className="space-y-2">
            <Label>Icon / Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-6 text-center text-sm transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {iconPreview ? (
                <div className="space-y-3">
                  <img
                    src={iconPreview}
                    alt="Category preview"
                    className="mx-auto h-20 w-20 rounded-lg object-cover"
                  />
                  <p>{fileName || "Image selected"}</p>
                </div>
              ) : (
                <p>Drag & drop or click to upload</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <AdminButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </AdminButton>
          <AdminButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </AdminButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
