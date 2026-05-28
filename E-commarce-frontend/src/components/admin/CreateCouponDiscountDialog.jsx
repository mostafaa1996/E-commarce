import { Currency, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/adminUI/dialog";
import { Label } from "@/components/genericComponents/Label";
import InputField from "@/components/genericComponents/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";
import { Switch } from "@/components/adminUI/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/adminUI/tabs";

const defaultCouponForm = {
  code: "",
  discountType: "",
  discountValue: "",
  eligibilityType: "",
  eligibilityValue: "",
  currency: "",
  expiry: "",
  usageLimit: "",
  active: true,
};

const defaultDiscountForm = {
  productSku: "",
  type: "",
  value: "",
  price: "",
  compareAtPrice: "",
  expiry: "",
  active: true,
};

const normalizeDateValue = (value) => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().split("T")[0];
};

const calculateDiscountedPrice = ({ type, value, compareAtPrice }) => {
  const basePrice = Number(compareAtPrice);
  const discountValue = Number(value);

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return "";
  }

  if (!Number.isFinite(discountValue) || discountValue < 0) {
    return String(basePrice);
  }

  if (type === "percentage") {
    const discounted = basePrice - basePrice * (discountValue / 100);
    return String(Math.max(discounted, 0).toFixed(2));
  }

  const discounted = basePrice - discountValue;
  return String(Math.max(discounted, 0).toFixed(2));
};

export function CreateCouponDiscountDialog({
  open,
  onOpenChange,
  initialMode = "coupon",
  initialData = null,
  hideTrigger = false,
  handleCreate,
  handleUpdate,
}) {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [couponForm, setCouponForm] = useState(defaultCouponForm);
  const [discountForm, setDiscountForm] = useState(defaultDiscountForm);
  const isEditing = Boolean(initialData);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode, open]);

  useEffect(() => {
    if (initialMode === "coupon") {
      setCouponForm({
        _id: initialData?.item?._id || "",
        code: initialData?.item?.code || "",
        discountType: initialData?.item?.discountType || "",
        discountValue: initialData?.item?.discountValue || "",
        eligibilityType: initialData?.item?.eligibilityType || "",
        eligibilityValue: initialData?.item?.eligibilityValue || "",
        currency: initialData?.item?.currency || "",
        expireDate: normalizeDateValue(initialData?.item?.expireDate),
        usageLimit: initialData?.item?.usageLimit || "",
        active: initialData?.item?.status ? initialData.item?.status === "ACTIVE" : true,
        DiscountTypesOptions : initialData?.discountTypesOptions || [],
        EligibilityTypesOptions : initialData?.eligibilityTypesOptions || [],
      });
      setDiscountForm(defaultDiscountForm);
      return;
    }

    setDiscountForm({
      _id: initialData?._id || "",
      productSku: initialData?.sku || "",
      type: initialData?.type?.toLowerCase() || "",
      value: initialData?.value || "",
      compareAtPrice: initialData?.compareAtPrice || "",
      expireDate: normalizeDateValue(initialData?.expireDate),
      active: initialData?.status ? initialData.status === "ACTIVE" : true,
    });
    setCouponForm(defaultCouponForm);
  }, [initialData, initialMode, open]);

  const handleDialogChange = (nextOpen) => {
    onOpenChange?.(nextOpen);
  };

  const dialogTitle = isEditing
    ? activeTab === "coupon"
      ? "Edit Coupon"
      : "Edit Discount"
    : "Create Coupon / Discount";

  const dialogDescription = isEditing
    ? "Update the selected promotion details."
    : "Choose whether this promotion applies to a customer coupon or a product discount.";
  const calculatedDiscountedPrice = calculateDiscountedPrice(discountForm);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <AdminButton>
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon / Discount
          </AdminButton>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="coupon">Coupon For Customer</TabsTrigger>
            <TabsTrigger value="discount">Discount On Product</TabsTrigger>
          </TabsList>
          <TabsContent value="coupon">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label>Coupon Code</Label>
                <InputField
                  placeholder="e.g. SUMMER60"
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={couponForm.discountType}
                  onValueChange={(value) =>
                    setCouponForm((prev) => ({ ...prev, discountType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {couponForm?.DiscountTypesOptions?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <InputField
                  type="number"
                  placeholder="0"
                  value={couponForm.discountValue}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      discountValue: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Eligibility Type</Label>
                <Select
                  value={couponForm.eligibilityType}
                  onValueChange={(value) =>
                    setCouponForm((prev) => ({ ...prev, eligibilityType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {couponForm?.EligibilityTypesOptions?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Eligibility Value</Label>
                <InputField
                  type="number"
                  placeholder="0.00"
                  value={couponForm.eligibilityValue}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      eligibilityValue: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <InputField
                  type="date"
                  value={couponForm.expireDate}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      expireDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <InputField
                  type="number"
                  placeholder="Unlimited"
                  value={couponForm.usageLimit}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      usageLimit: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Switch
                  id="coupon-active"
                  checked={couponForm.active}
                  onCheckedChange={(checked) =>
                    setCouponForm((prev) => ({ ...prev, active: checked }))
                  }
                />
                <Label htmlFor="coupon-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <AdminButton
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                onClick={
                  isEditing
                    ? () => handleUpdate(couponForm)
                    : () => handleCreate(activeTab , couponForm)
                }
              >
                {isEditing ? "Save Coupon" : "Create Coupon"}
              </AdminButton>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="discount">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Chosen Product</Label>
                <InputField
                  placeholder="Enter product SKU"
                  value={discountForm.productSku}
                  onChange={(e) =>
                    setDiscountForm((prev) => ({
                      ...prev,
                      productSku: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={discountForm.type}
                  onValueChange={(value) =>
                    setDiscountForm((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <InputField
                  type="number"
                  placeholder="0"
                  value={discountForm.value}
                  onChange={(e) =>
                    setDiscountForm((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Discounted Price</Label>
                <InputField
                  type="number"
                  placeholder="0.00"
                  value={calculatedDiscountedPrice}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Compare At Price</Label>
                <InputField
                  type="number"
                  placeholder="0.00"
                  value={discountForm.compareAtPrice}
                  onChange={(e) =>
                    setDiscountForm((prev) => ({
                      ...prev,
                      compareAtPrice: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <InputField
                  type="date"
                  value={discountForm.expireDate}
                  onChange={(e) =>
                    setDiscountForm((prev) => ({
                      ...prev,
                      expireDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Switch
                  id="discount-active"
                  checked={discountForm.active}
                  onCheckedChange={(checked) =>
                    setDiscountForm((prev) => ({ ...prev, active: checked}))
                  }
                />
                <Label htmlFor="discount-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <AdminButton
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                onClick={
                  isEditing
                    ? () => handleUpdate(discountForm)
                    : () => handleCreate(activeTab , discountForm)
                }
              >
                {isEditing ? "Save Discount" : "Create Discount"}
              </AdminButton>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
