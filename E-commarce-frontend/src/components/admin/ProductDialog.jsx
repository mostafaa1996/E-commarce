import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  GripVertical,
  Image as ImageIcon,
  Layers,
  Package,
  Plus,
  Search as SearchIcon,
  Settings2,
  Sparkles,
  Star,
  Tag as TagIcon,
  Trash2,
  Truck,
  Undo2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/adminUI/dialog";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { Switch } from "@/components/adminUI/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";
import { Separator } from "@/components/adminUI/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/adminUI/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/adminUI/card";
import { Badge } from "@/components/adminUI/badge";
import InputField from "@/components/genericComponents/InputField";
import TextArea from "@/components/genericComponents/textarea";
import { Label } from "@/components/genericComponents/Label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";

const uid = () => Math.random().toString(36).slice(2, 15);

// const fakeProduct = {
//   //for testing purposes
// }

function fillAttributesOfAddProduct(){
  //for testing purposes
  // return structuredClone(fakeProduct);
  return null;
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const isValidHex = (value) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(value.trim());

const buildSku = (variant) => {
  const id1 = uid();
  const id2 = uid();

  return [
    `v1|${id1}|${id2}`,
    variant.attributes.color.code ||
      variant.attributes.color.name?.slice(0, 3).toUpperCase(),
    variant.attributes.storage,
    variant.attributes.ram,
  ]
    .filter(Boolean)
    .join("-");
};

const emptyVariant = () => ({
  id: uid(),
  sku: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  lowStockThreshold: "5",
  availabilityStatus: "IN_STOCK",
  isActive: true,
  attributes: {
    color: { name: "", code: "", hex: "" },
    storage: "",
    ram: "",
  },
});

const initialState = () => ({
  title: "",
  slug: "",
  slugAuto: true,
  shortDescription: "",
  description: "",
  brand: "",
  category: "",
  sourceCategoryName: "",
  isActive: true,
  status: "New",
  price: "",
  originalPrice: "",
  currency: "USD",
  mainImage: { url: "", alt: "" },
  images: [],
  specifications: [{ id: uid(), name: "", value: "" }],
  seo: { metaTitle: "", metaDescription: "" },
  hasVariants: false,
  variants: [],
  defaultVariantId: "",
  stock: "0",
  sku: "",
  shipping: {
    estimatedDeliveryMinDate: "",
    estimatedDeliveryMaxDate: "",
    shipsFrom: "",
    costs: [],
  },
  returnPolicy: {
    isReturnAccepted: true,
    returnWindowDays: "14",
    returnFeesPaidBy: "BUYER",
    notes: "",
  },
  tags: [],
  reviewSummary: { averageRating: "", totalReviews: "" },
});

function SectionCard({ icon: Icon, title, description, children, badge }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          {badge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">{children}</CardContent>
    </Card>
  );
}

export function ProductDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSubmit,
  trigger,
  mode = "create",
  initialData,
  onEditFromView,
}) {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const [data, setData] = useState(initialState());
  const [tagDraft, setTagDraft] = useState("");
  const [touched, setTouched] = useState(false);
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isControlled =
    typeof controlledOpen === "boolean" &&
    typeof controlledOnOpenChange === "function";
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled
    ? controlledOnOpenChange
    : setInternalOpen;

  const hydrateData = (seed) => {
    const base = initialState();

    if (!seed) return base;

    const hydratedImages =
      seed.images?.map((image) => ({
        id: image.id || uid(),
        url: image.url || "",
        alt: image.alt || "",
      })) || base.images;

    const hydratedSpecs =
      seed.specifications?.length > 0
        ? seed.specifications.map((spec) => ({
            id: spec.id || uid(),
            name: spec.name || "",
            value: spec.value || "",
          }))
        : base.specifications;

    const hydratedVariants =
      seed.variants?.map((variant) => ({
        ...emptyVariant(),
        ...variant,
        id: variant.id || variant._id || uid(),
        price: variant.price != null ? String(variant.price) : "",
        compareAtPrice:
          variant.compareAtPrice != null ? String(variant.compareAtPrice) : "",
        stock: variant.stock != null ? String(variant.stock) : "0",
        lowStockThreshold:
          variant.lowStockThreshold != null
            ? String(variant.lowStockThreshold)
            : "5",
        availabilityStatus:
          variant.availabilityStatus?.toUpperCase() || "IN_STOCK",
        attributes: {
          ...emptyVariant().attributes,
          ...(variant.attributes || {}),
          color: {
            ...emptyVariant().attributes.color,
            ...(variant.attributes?.color || {}),
          },
        },
      })) || base.variants;

    return {
      ...base,
      ...seed,
      mainImage: { ...base.mainImage, ...(seed.mainImage || {}) },
      seo: { ...base.seo, ...(seed.seo || {}) },
      shipping: {
        ...base.shipping,
        ...(seed.shipping || {}),
        costs:
          seed.shipping?.costs?.map((cost) => ({
            id: cost.id || uid(),
            shipsTo: cost.shipsTo || "",
            cost: cost.cost != null ? String(cost.cost) : "",
          })) || base.shipping.costs,
      },
      returnPolicy: {
        ...base.returnPolicy,
        ...(seed.returnPolicy || {}),
      },
      reviewSummary: {
        ...base.reviewSummary,
        ...(seed.reviewSummary || {}),
      },
      specifications: hydratedSpecs,
      images: hydratedImages,
      variants: hydratedVariants,
      defaultVariantId: seed.defaultVariantId || hydratedVariants[0]?.id || "",
      tags: seed.tags || base.tags,
    };
  };

  useEffect(() => {
    if (open) {
      const seedData =
        mode === "create" && !initialData
          ? fillAttributesOfAddProduct()
          : initialData;
      setData(hydrateData(seedData));
      setTagDraft("");
      setTouched(false);
    }
  }, [open, initialData, mode]);

  useEffect(() => {
    if (data.slugAuto) {
      setData((current) => ({ ...current, slug: slugify(current.title) }));
    }
  }, [data.title, data.slugAuto]);

  const skuCounts = useMemo(() => {
    const counts = new Map();

    data.variants.forEach((variant) => {
      const key = variant.sku.trim();
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });

    return counts;
  }, [data.variants]);

  const totalStock = useMemo(
    () =>
      data.hasVariants
        ? data.variants
            .filter((variant) => variant.isActive)
            .reduce((total, variant) => total + (Number(variant.stock) || 0), 0)
        : Number(data.stock) || 0,
    [data.hasVariants, data.stock, data.variants],
  );

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!data.title.trim()) nextErrors.title = "Title is required";
    if (!data.slug.trim()) nextErrors.slug = "Slug is required";
    if (!data.category) nextErrors.category = "Category is required";
    if (!data.currency) nextErrors.currency = "Currency is required";
    if (!data.mainImage.url.trim()) {
      nextErrors.mainImage = "Main image URL is required";
    }

    if (!data.hasVariants) {
      if (!data.price.trim() || Number(data.price) <= 0) {
        nextErrors.price = "Valid price is required";
      }
    } else {
      if (data.variants.length === 0) {
        nextErrors.variants = "Add at least one variant";
      }
      if (!data.defaultVariantId) {
        nextErrors.defaultVariant = "Select a default variant";
      }

      data.variants.forEach((variant, index) => {
        if (!variant.sku.trim()) {
          nextErrors[`v_${index}_sku`] = "SKU required";
        } else if ((skuCounts.get(variant.sku.trim()) || 0) > 1) {
          nextErrors[`v_${index}_sku`] = "Duplicate SKU";
        }

        if (!variant.price.trim() || Number(variant.price) <= 0) {
          nextErrors[`v_${index}_price`] = "Price required";
        }

        if (Number(variant.stock) < 0) {
          nextErrors[`v_${index}_stock`] = "Stock must be >= 0";
        }

        if (
          variant.attributes.color.hex &&
          !isValidHex(variant.attributes.color.hex)
        ) {
          nextErrors[`v_${index}_hex`] = "Invalid hex (e.g. #0F4C81)";
        }
      });
    }

    if (data.seo.metaTitle.length > 100) {
      nextErrors.metaTitle = "Max 100 characters";
    }

    if (data.seo.metaDescription.length > 160) {
      nextErrors.metaDescription = "Max 160 characters";
    }

    if (
      data.returnPolicy.isReturnAccepted &&
      (!data.returnPolicy.returnWindowDays ||
        Number(data.returnPolicy.returnWindowDays) <= 0)
    ) {
      nextErrors.returnWindow = "Must be a positive number";
    }

    data.shipping.costs.forEach((cost, index) => {
      if (cost.cost && Number(cost.cost) < 0) {
        nextErrors[`ship_${index}`] = "Cost must be >= 0";
      }
    });

    return nextErrors;
  }, [data, skuCounts]);

  const errorCount = Object.keys(errors).length;

  const getErrorFieldLabel = (key) => {
    const labels = {
      title: "Title",
      slug: "Slug",
      category: "Category",
      currency: "Currency",
      mainImage: "Main Image URL",
      price: "Price",
      variants: "Variants",
      defaultVariant: "Default Variant",
      metaTitle: "SEO Meta Title",
      metaDescription: "SEO Meta Description",
      returnWindow: "Return Window",
    };

    if (labels[key]) return labels[key];

    const variantMatch = key.match(/^v_(\d+)_(sku|price|stock|hex)$/);
    if (variantMatch) {
      const [, index, field] = variantMatch;
      const fieldLabels = {
        sku: "SKU",
        price: "Price",
        stock: "Stock",
        hex: "Color Hex",
      };
      return `Variant ${Number(index) + 1} ${fieldLabels[field] || field}`;
    }

    const shippingMatch = key.match(/^ship_(\d+)$/);
    if (shippingMatch) {
      return `Shipping Cost ${Number(shippingMatch[1]) + 1}`;
    }

    return key;
  };

  const update = (key, value) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const updateNested = (path, value) => {
    setData((current) => {
      const next = structuredClone(current);
      const keys = path.split(".");
      let cursor = next;

      for (let index = 0; index < keys.length - 1; index += 1) {
        cursor = cursor[keys[index]];
      }

      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const addImage = () => {
    update("images", [...data.images, { id: uid(), url: "", alt: "" }]);
  };

  const removeImage = (id) => {
    update(
      "images",
      data.images.filter((image) => image.id !== id),
    );
  };

  const moveImage = (id, dir) => {
    const index = data.images.findIndex((image) => image.id === id);
    if (index < 0) return;

    const next = [...data.images];
    const target = index + dir;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    update("images", next);
  };

  const addSpec = () => {
    update("specifications", [
      ...data.specifications,
      { id: uid(), name: "", value: "" },
    ]);
  };

  const removeSpec = (id) => {
    update(
      "specifications",
      data.specifications.filter((spec) => spec.id !== id),
    );
  };

  const addCost = () => {
    updateNested("shipping.costs", [
      ...data.shipping.costs,
      { id: uid(), shipsTo: "", cost: "" },
    ]);
  };

  const removeCost = (id) => {
    updateNested(
      "shipping.costs",
      data.shipping.costs.filter((cost) => cost.id !== id),
    );
  };

  const addTag = () => {
    const nextTag = tagDraft.trim();
    if (!nextTag) return;

    if (data.tags.includes(nextTag)) {
      setTagDraft("");
      return;
    }

    update("tags", [...data.tags, nextTag]);
    setTagDraft("");
  };

  const removeTag = (tag) => {
    update(
      "tags",
      data.tags.filter((currentTag) => currentTag !== tag),
    );
  };

  const addVariant = () => {
    const variant = emptyVariant();
    setData((current) => ({
      ...current,
      variants: [...current.variants, variant],
      defaultVariantId: current.defaultVariantId || variant.id,
    }));
  };

  const duplicateVariant = (id) => {
    const source = data.variants.find((variant) => variant.id === id);
    if (!source) return;

    update("variants", [
      ...data.variants,
      {
        ...structuredClone(source),
        id: uid(),
        sku: source.sku ? `${source.sku}-COPY` : "",
      },
    ]);
  };

  const removeVariant = (id) => {
    const next = data.variants.filter((variant) => variant.id !== id);

    setData((current) => ({
      ...current,
      variants: next,
      defaultVariantId:
        current.defaultVariantId === id ? next[0]?.id || "" : current.defaultVariantId,
    }));
  };

  const patchVariant = (id, patch) => {
    update(
      "variants",
      data.variants.map((variant) =>
        variant.id === id
          ? typeof patch === "function"
            ? patch(variant)
            : { ...variant, ...patch }
          : variant,
      ),
    );
  };

  const autoGenerateSku = (id) => {
    const variant = data.variants.find((item) => item.id === id);
    if (!variant) return;

    patchVariant(id, { sku: buildSku(variant) });
  };

  const handleSubmit = (mode) => {
    if (isViewMode) return;

    setTouched(true);

    if ((mode === "create" || mode === "edit") && errorCount > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      toast({
        title: "Please fix validation errors",
        description:
          errorCount === 1
            ? `${getErrorFieldLabel(firstErrorKey)} needs attention.`
            : `${errorCount} fields need attention.`,
        variant: "destructive",
      });
      return;
    }

    if (onSubmit) {
      const { reviewSummary, defaultVariantId, ...payload } = data;
      onSubmit(payload, mode);
    }

    toast({
      title:
        mode === "draft"
          ? "Draft saved"
          : mode === "edit"
          ? "Product updated"
          : "Product created",
      description: data.title || "Untitled product",
    });

    // onOpenChange(false);
  };

  const showError = (key) => touched && errors[key];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="flex max-h-[92vh] max-w-5xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">
                {isViewMode
                  ? "Product Details"
                  : isEditMode
                  ? "Edit Product"
                  : "Add New Product"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isViewMode
                  ? "Review the product information."
                  : isEditMode
                  ? "Update the product details."
                  : "Create a schema-aligned product with media, variants, SEO, and shipping."}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {isViewMode ? (
                <Badge variant="secondary">Read only</Badge>
              ) : touched && errorCount > 0 ? (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errorCount} issue{errorCount === 1 ? "" : "s"}
                </Badge>
              ) : (
                <Badge className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-700">
                  <Check className="h-3 w-3" />
                  Ready
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div
          aria-readonly={isViewMode}
          className="flex-1 space-y-6 overflow-y-auto bg-muted/30 px-6 py-6"
        >
          <SectionCard
            icon={Package}
            title="Basic Information"
            description="Core product details visible to customers."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label>
                  Title <span className="text-destructive">*</span>
                </Label>
                <InputField
                  placeholder="e.g. Aurora Pro Wireless Headphones"
                  value={data.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={cn(showError("title") && "border-destructive")}
                />
                {showError("title") && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Auto-generate</span>
                    <Switch
                      checked={data.slugAuto}
                      onCheckedChange={(checked) => update("slugAuto", checked)}
                    />
                  </div>
                </div>
                <InputField
                  placeholder="aurora-pro-wireless-headphones"
                  value={data.slug}
                  disabled={data.slugAuto}
                  onChange={(e) => update("slug", slugify(e.target.value))}
                  className={cn(showError("slug") && "border-destructive")}
                />
                <p className="text-xs text-muted-foreground">
                  Used in the product URL. Lowercase, hyphenated.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Brand</Label>
                <InputField
                  placeholder="Aurora Audio"
                  value={data.brand}
                  onChange={(e) => update("brand", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={data.category}
                  onValueChange={(value) => update("category", value)}
                >
                  <SelectTrigger
                    className={cn(showError("category") && "border-destructive")}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tablets">Tablets</SelectItem>
                    <SelectItem value="Monitors">Monitors</SelectItem>
                    <SelectItem value="Gaming Accessories">Gaming Accessories</SelectItem>
                    <SelectItem value="Smartphones">Smartphones</SelectItem>
                    <SelectItem value="Headphones">Headphones</SelectItem>
                    <SelectItem value="Smart Home">Smart Home</SelectItem>
                    <SelectItem value="Cameras">Cameras</SelectItem>
                    <SelectItem value="Laptops">Laptops</SelectItem>
                    <SelectItem value="Smart Watches">Smart Watches</SelectItem>
                    <SelectItem value="Computer Accessories">Computer Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Source Category Name{" "}
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <InputField
                  placeholder="External / supplier category"
                  value={data.sourceCategoryName}
                  onChange={(e) => update("sourceCategoryName", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={data.status}
                  onValueChange={(value) => update("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-y-1.5">
                <div className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-xs text-muted-foreground">
                      Visible in storefront
                    </p>
                  </div>
                  <Switch
                    checked={data.isActive}
                    onCheckedChange={(checked) => update("isActive", checked)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label>Short Description</Label>
                <InputField
                  placeholder="One-line summary shown in product cards"
                  value={data.shortDescription}
                  onChange={(e) => update("shortDescription", e.target.value)}
                  maxLength={200}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {data.shortDescription.length}/200
                </p>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label>Description</Label>
                <TextArea
                  placeholder="Tell customers everything about this product..."
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={TagIcon}
            title="Pricing"
            description={
              data.hasVariants
                ? "Final sellable pricing comes from variants below."
                : "Set the base price for this product."
            }
            badge={
              data.hasVariants ? (
                <Badge variant="secondary" className="text-xs">
                  Managed by variants
                </Badge>
              ) : undefined
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label>
                  Price {!data.hasVariants && <span className="text-destructive">*</span>}
                </Label>
                <InputField
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={data.price}
                  onChange={(e) => update("price", e.target.value)}
                  disabled={data.hasVariants}
                  className={cn(showError("price") && "border-destructive")}
                />
                {showError("price") && (
                  <p className="text-xs text-destructive">{errors.price}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>
                  Original Price{" "}
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <InputField
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={data.originalPrice}
                  onChange={(e) => update("originalPrice", e.target.value)}
                  disabled={data.hasVariants}
                />
              </div>

              <div className="space-y-1.5">
                <Label>
                  Currency <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={data.currency}
                  onValueChange={(value) => update("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="EGP">EGP - Egyptian Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={ImageIcon}
            title="Media"
            description="Add a main image and additional gallery images."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px,1fr]">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-background">
                {data.mainImage.url ? (
                  <img
                    src={data.mainImage.url}
                    alt={data.mainImage.alt}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto mb-2 h-8 w-8 opacity-60" />
                    <p className="text-xs">Main image preview</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>
                    Main Image URL <span className="text-destructive">*</span>
                  </Label>
                  <InputField
                    placeholder="https://..."
                    value={data.mainImage.url}
                    onChange={(e) => updateNested("mainImage.url", e.target.value)}
                    className={cn(showError("mainImage") && "border-destructive")}
                  />
                  {showError("mainImage") && (
                    <p className="text-xs text-destructive">{errors.mainImage}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Alt Text</Label>
                  <InputField
                    placeholder="Describe the image for accessibility & SEO"
                    value={data.mainImage.alt}
                    onChange={(e) => updateNested("mainImage.alt", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Gallery Images</p>
                <AdminButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImage}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Image
                </AdminButton>
              </div>

              {data.images.length === 0 && (
                <p className="text-xs italic text-muted-foreground">
                  No additional images yet.
                </p>
              )}

              <div className="space-y-2">
                {data.images.map((image, index) => (
                  <div
                    key={image.id}
                    className="grid grid-cols-[40px,72px,1fr,1fr,auto] items-center gap-2 rounded-md border bg-background p-2"
                  >
                    <div className="flex flex-col items-center text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => moveImage(image.id, -1)}
                        disabled={index === 0}
                        className="text-xs hover:text-foreground disabled:opacity-30"
                      >
                        ^
                      </button>
                      <GripVertical className="my-0.5 h-3 w-3" />
                      <button
                        type="button"
                        onClick={() => moveImage(image.id, 1)}
                        disabled={index === data.images.length - 1}
                        className="text-xs hover:text-foreground disabled:opacity-30"
                      >
                        v
                      </button>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-muted">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <InputField
                      placeholder="Image URL"
                      value={image.url}
                      onChange={(e) =>
                        update(
                          "images",
                          data.images.map((item) =>
                            item.id === image.id
                              ? { ...item, url: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />

                    <InputField
                      placeholder="Alt text"
                      value={image.alt}
                      onChange={(e) =>
                        update(
                          "images",
                          data.images.map((item) =>
                            item.id === image.id
                              ? { ...item, alt: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />

                    <AdminButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImage(image.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </AdminButton>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={Layers}
            title="Variants"
            description="Offer multiple options like color, storage, or RAM."
            badge={
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Has Variants</span>
                <Switch
                  checked={data.hasVariants}
                  onCheckedChange={(checked) => {
                    update("hasVariants", checked);
                    if (checked && data.variants.length === 0) addVariant();
                  }}
                />
              </div>
            }
          >
            {!data.hasVariants ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>SKU</Label>
                  <InputField
                    placeholder="SKU-0001"
                    value={data.sku}
                    onChange={(e) => update("sku", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Stock Quantity</Label>
                  <InputField
                    type="number"
                    min="0"
                    placeholder="0"
                    value={data.stock}
                    onChange={(e) => update("stock", e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground md:col-span-2">
                  <Package className="h-4 w-4" />
                  Total inventory:
                  <span className="font-semibold text-foreground">{totalStock}</span>
                  units
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {showError("variants") && (
                  <p className="text-xs text-destructive">{errors.variants}</p>
                )}
                {showError("defaultVariant") && (
                  <p className="text-xs text-destructive">
                    {errors.defaultVariant}
                  </p>
                )}

                <div className="space-y-3">
                  {data.variants.map((variant, index) => {
                    const isDefault = data.defaultVariantId === variant.id;
                    const duplicateSku = (skuCounts.get(variant.sku.trim()) || 0) > 1;

                    return (
                      <div
                        key={variant.id}
                        className={cn(
                          "space-y-3 rounded-lg border bg-background p-4",
                          isDefault && "border-primary/50 ring-1 ring-primary/30",
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Variant {index + 1}
                            </Badge>
                            {isDefault ? (
                              <Badge className="border-primary/30 bg-primary/10 text-xs text-primary">
                                <Star className="mr-1 h-3 w-3 fill-current" />
                                Default
                              </Badge>
                            ) : (
                              <AdminButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => update("defaultVariantId", variant.id)}
                              >
                                <Star className="mr-1 h-3 w-3" />
                                Set as default
                              </AdminButton>
                            )}
                            {duplicateSku && (
                              <Badge variant="destructive" className="text-xs">
                                Duplicate SKU
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="mr-2 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Active</span>
                              <Switch
                                checked={variant.isActive}
                                onCheckedChange={(checked) =>
                                  patchVariant(variant.id, { isActive: checked })
                                }
                              />
                            </div>
                            <AdminButton
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => duplicateVariant(variant.id)}
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
                            </AdminButton>
                            <AdminButton
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeVariant(variant.id)}
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </AdminButton>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                          <div className="space-y-1">
                            <Label className="text-xs">Color name</Label>
                            <InputField
                              placeholder="Midnight Blue"
                              value={variant.attributes.color.name}
                              onChange={(e) =>
                                patchVariant(variant.id, (current) => ({
                                  ...current,
                                  attributes: {
                                    ...current.attributes,
                                    color: {
                                      ...current.attributes.color,
                                      name: e.target.value,
                                    },
                                  },
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Color code</Label>
                            <InputField
                              placeholder="MDB"
                              value={variant.attributes.color.code}
                              onChange={(e) =>
                                patchVariant(variant.id, (current) => ({
                                  ...current,
                                  attributes: {
                                    ...current.attributes,
                                    color: {
                                      ...current.attributes.color,
                                      code: e.target.value.toUpperCase(),
                                    },
                                  },
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Hex</Label>
                            <div className="flex gap-1.5">
                              <div
                                className="h-9 w-9 shrink-0 rounded-md border"
                                style={{
                                  backgroundColor: isValidHex(
                                    variant.attributes.color.hex,
                                  )
                                    ? variant.attributes.color.hex
                                    : "transparent",
                                }}
                              />
                              <InputField
                                placeholder="#0F4C81"
                                value={variant.attributes.color.hex}
                                onChange={(e) =>
                                  patchVariant(variant.id, (current) => ({
                                    ...current,
                                    attributes: {
                                      ...current.attributes,
                                      color: {
                                        ...current.attributes.color,
                                        hex: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className={cn(
                                  showError(`v_${index}_hex`) && "border-destructive",
                                )}
                              />
                            </div>
                            {showError(`v_${index}_hex`) && (
                              <p className="text-xs text-destructive">
                                {errors[`v_${index}_hex`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Storage</Label>
                            <InputField
                              placeholder="128GB"
                              value={variant.attributes.storage}
                              onChange={(e) =>
                                patchVariant(variant.id, (current) => ({
                                  ...current,
                                  attributes: {
                                    ...current.attributes,
                                    storage: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">RAM</Label>
                            <InputField
                              placeholder="8GB"
                              value={variant.attributes.ram}
                              onChange={(e) =>
                                patchVariant(variant.id, (current) => ({
                                  ...current,
                                  attributes: {
                                    ...current.attributes,
                                    ram: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                          <div className="space-y-1 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">SKU</Label>
                              <button
                                type="button"
                                onClick={() => autoGenerateSku(variant.id)}
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <Sparkles className="h-3 w-3" />
                                Auto
                              </button>
                            </div>
                            <InputField
                              placeholder="Auto-generated or custom"
                              value={variant.sku}
                              onChange={(e) =>
                                patchVariant(variant.id, { sku: e.target.value })
                              }
                              className={cn(
                                showError(`v_${index}_sku`) && "border-destructive",
                              )}
                            />
                            {showError(`v_${index}_sku`) && (
                              <p className="text-xs text-destructive">
                                {errors[`v_${index}_sku`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Price</Label>
                            <InputField
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={variant.price}
                              onChange={(e) =>
                                patchVariant(variant.id, { price: e.target.value })
                              }
                              className={cn(
                                showError(`v_${index}_price`) && "border-destructive",
                              )}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Compare at</Label>
                            <InputField
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={variant.compareAtPrice}
                              onChange={(e) =>
                                patchVariant(variant.id, {
                                  compareAtPrice: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Stock</Label>
                            <InputField
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(e) =>
                                patchVariant(variant.id, { stock: e.target.value })
                              }
                              className={cn(
                                showError(`v_${index}_stock`) && "border-destructive",
                              )}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Low stock</Label>
                            <InputField
                              type="number"
                              min="0"
                              value={variant.lowStockThreshold}
                              onChange={(e) =>
                                patchVariant(variant.id, {
                                  lowStockThreshold: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Availability</Label>
                            <Select
                              value={variant.availabilityStatus}
                              onValueChange={(value) =>
                                patchVariant(variant.id, {
                                  availabilityStatus: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                                <SelectItem value="OUT_OF_STOCK">
                                  Out of Stock
                                </SelectItem>
                                <SelectItem value="PREORDER">Preorder</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Generated SKU preview</Label>
                            <div className="flex h-9 items-center rounded-md border bg-muted px-3 font-mono text-xs text-muted-foreground">
                              {buildSku(variant) || "--"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <AdminButton
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </AdminButton>

                <div className="flex items-center gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  Total inventory across active variants:
                  <span className="font-semibold text-foreground">{totalStock}</span>
                  units
                </div>
              </div>
            )}
          </SectionCard>

          <Card className="border-border/60 shadow-sm">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="specs" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Settings2 className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Specifications</p>
                      <p className="text-xs text-muted-foreground">
                        Key/value pairs shown on the product page.
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 px-6 pb-5">
                  {data.specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="grid grid-cols-[1fr,1fr,auto] gap-2"
                    >
                      <InputField
                        placeholder="Name (e.g. Battery)"
                        value={spec.name}
                        onChange={(e) =>
                          update(
                            "specifications",
                            data.specifications.map((item) =>
                              item.id === spec.id
                                ? { ...item, name: e.target.value }
                                : item,
                            ),
                          )
                        }
                      />
                      <InputField
                        placeholder="Value (e.g. 30 hours)"
                        value={spec.value}
                        onChange={(e) =>
                          update(
                            "specifications",
                            data.specifications.map((item) =>
                              item.id === spec.id
                                ? { ...item, value: e.target.value }
                                : item,
                            ),
                          )
                        }
                      />
                      <AdminButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpec(spec.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </AdminButton>
                    </div>
                  ))}
                  <AdminButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpec}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Specification
                  </AdminButton>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="seo" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <SearchIcon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">SEO</p>
                      <p className="text-xs text-muted-foreground">
                        Improve search engine visibility.
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 px-6 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label>Meta Title</Label>
                      <span
                        className={cn(
                          "text-xs",
                          data.seo.metaTitle.length > 100
                            ? "text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        {data.seo.metaTitle.length}/100
                      </span>
                    </div>
                    <InputField
                      placeholder="Concise, keyword-rich title"
                      value={data.seo.metaTitle}
                      onChange={(e) =>
                        updateNested("seo.metaTitle", e.target.value)
                      }
                      className={cn(showError("metaTitle") && "border-destructive")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label>Meta Description</Label>
                      <span
                        className={cn(
                          "text-xs",
                          data.seo.metaDescription.length > 160
                            ? "text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        {data.seo.metaDescription.length}/160
                      </span>
                    </div>
                    <TextArea
                      placeholder="A compelling summary for search results"
                      value={data.seo.metaDescription}
                      onChange={(e) =>
                        updateNested("seo.metaDescription", e.target.value)
                      }
                      rows={3}
                      className={cn(
                        showError("metaDescription") && "border-destructive",
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Shipping</p>
                      <p className="text-xs text-muted-foreground">
                        Delivery estimates and shipping costs.
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 px-6 pb-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>Min delivery date</Label>
                      <InputField
                        type="date"
                        value={data.shipping.estimatedDeliveryMinDate?.slice(0, 10)||""}
                        onChange={(e) =>
                          updateNested(
                            "shipping.estimatedDeliveryMinDate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Max delivery date</Label>
                      <InputField
                        type="date"
                        value={data.shipping.estimatedDeliveryMaxDate?.slice(0, 10)||""}
                        onChange={(e) =>
                          updateNested(
                            "shipping.estimatedDeliveryMaxDate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Ships from</Label>
                      <InputField
                        placeholder="e.g. Berlin, Germany"
                        value={data.shipping.shipsFrom}
                        onChange={(e) =>
                          updateNested("shipping.shipsFrom", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Shipping Costs</p>
                      <AdminButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCost}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Region
                      </AdminButton>
                    </div>

                    {data.shipping.costs.length === 0 && (
                      <p className="text-xs italic text-muted-foreground">
                        No regional costs set.
                      </p>
                    )}

                    {data.shipping.costs.map((cost, index) => (
                      <div
                        key={cost.id}
                        className="grid grid-cols-[1fr,160px,auto] gap-2"
                      >
                        <InputField
                          placeholder="Ships to (e.g. United States)"
                          value={cost.shipsTo}
                          onChange={(e) =>
                            updateNested(
                              "shipping.costs",
                              data.shipping.costs.map((item) =>
                                item.id === cost.id
                                  ? { ...item, shipsTo: e.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                        <InputField
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Cost"
                          value={cost.cost}
                          onChange={(e) =>
                            updateNested(
                              "shipping.costs",
                              data.shipping.costs.map((item) =>
                                item.id === cost.id
                                  ? { ...item, cost: e.target.value }
                                  : item,
                              ),
                            )
                          }
                          className={cn(
                            showError(`ship_${index}`) && "border-destructive",
                          )}
                        />
                        <AdminButton
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCost(cost.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </AdminButton>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="return" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Undo2 className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Return Policy</p>
                      <p className="text-xs text-muted-foreground">
                        Configure customer return options.
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 px-6 pb-5">
                  <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">Accept returns</p>
                      <p className="text-xs text-muted-foreground">
                        Allow customers to return this product
                      </p>
                    </div>
                    <Switch
                      checked={data.returnPolicy.isReturnAccepted}
                      onCheckedChange={(checked) =>
                        updateNested("returnPolicy.isReturnAccepted", checked)
                      }
                    />
                  </div>

                  {data.returnPolicy.isReturnAccepted && (
                    <>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label>Return window (days)</Label>
                          <InputField
                            type="number"
                            min="1"
                            value={data.returnPolicy.returnWindowDays}
                            onChange={(e) =>
                              updateNested(
                                "returnPolicy.returnWindowDays",
                                e.target.value,
                              )
                            }
                            className={cn(
                              showError("returnWindow") && "border-destructive",
                            )}
                          />
                          {showError("returnWindow") && (
                            <p className="text-xs text-destructive">
                              {errors.returnWindow}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label>Return fees paid by</Label>
                          <Select
                            value={data.returnPolicy.returnFeesPaidBy}
                            onValueChange={(value) =>
                              updateNested("returnPolicy.returnFeesPaidBy", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BUYER">Buyer</SelectItem>
                              <SelectItem value="SELLER">Seller</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Notes</Label>
                        <TextArea
                          placeholder="Any extra return policy notes..."
                          value={data.returnPolicy.notes}
                          onChange={(e) =>
                            updateNested("returnPolicy.notes", e.target.value)
                          }
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tags" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TagIcon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Tags</p>
                      <p className="text-xs text-muted-foreground">
                        Add searchable tags for this product.
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 px-6 pb-5">
                  <div className="flex gap-2">
                    <InputField
                      placeholder="Type a tag and press Enter"
                      value={tagDraft}
                      onChange={(e) => setTagDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <AdminButton type="button" variant="outline" onClick={addTag}>
                      Add
                    </AdminButton>
                  </div>

                  {data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 py-1 pl-3 pr-1 text-xs"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 rounded-full p-0.5 hover:bg-background/60"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="reviews">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Star className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Review Summary</p>
                      <p className="text-xs text-muted-foreground">
                        Optional manual override. Usually computed from reviews.
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Average Rating</Label>
                      <InputField
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="0.0"
                        value={data.reviewSummary.averageRating}
                        onChange={(e) =>
                          updateNested(
                            "reviewSummary.averageRating",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Total Reviews</Label>
                      <InputField
                        type="number"
                        min="0"
                        placeholder="0"
                        value={data.reviewSummary.reviewsCount}
                        onChange={(e) =>
                          updateNested(
                            "reviewSummary.reviewsCount",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>

        <div className="flex items-center justify-between gap-3 border-t bg-background px-6 py-4">
          <p className="hidden text-xs text-muted-foreground sm:block">
            {data.hasVariants
              ? `${data.variants.length} variant${
                  data.variants.length === 1 ? "" : "s"
                } - ${totalStock} units`
              : `${totalStock} units in stock`}
          </p>
          <div className="ml-auto flex items-center gap-2">
            {isViewMode ? (
              <>
                <AdminButton variant="ghost" onClick={() => onOpenChange(false)}>
                  Close
                </AdminButton>
                {onEditFromView ? (
                  <AdminButton onClick={onEditFromView}>Edit Product</AdminButton>
                ) : null}
              </>
            ) : isEditMode ? (
              <>
                <AdminButton variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </AdminButton>
                <AdminButton onClick={() => handleSubmit("edit")}>
                  Save Changes
                </AdminButton>
              </>
            ) : (
              <>
                <AdminButton variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </AdminButton>
                <AdminButton variant="outline" onClick={() => handleSubmit("draft")}>
                  Save Draft
                </AdminButton>
                <AdminButton onClick={() => handleSubmit("create")}>
                  Create Product
                </AdminButton>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ProductDialog as ProductFormDialog };
