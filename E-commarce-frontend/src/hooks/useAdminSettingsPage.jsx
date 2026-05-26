import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAdminSettings,
  updateAdminPassword,
  updateAdminProfile,
  updateAdminStore,
} from "@/APIs/adminSettingsService";
import { queryClient } from "@/queryClient";
import { useToast } from "@/hooks/use-toast";

export const DEFAULT_PROFILE = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@shoplite.com",
  phone: "+20 123 456 789",
  image: null,
};

export const DEFAULT_STORE = {
  storeName: "ShopLite",
  supportEmail: "support@shoplite.com",
  phone: "+20 112 233 44455",
  shippingFee: "16.79",
  address: "Alexandria, Egypt",
  workingDays: "sun-thu, 9:00am- 8:00pm",
};

const DEFAULT_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getInitials(firstName, lastName, email) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (fullName) {
    return fullName
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  return email?.slice(0, 2).toUpperCase() || "AD";
}

function getValue(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
}

function normalizeSettings(settings) {
  return {
    profile: {
      firstName: getValue(
        settings?.profile?.firstName,
        settings?.admin?.firstName,
        settings?.firstName,
        DEFAULT_PROFILE.firstName,
      ),
      lastName: getValue(
        settings?.profile?.lastName,
        settings?.admin?.lastName,
        settings?.lastName,
        DEFAULT_PROFILE.lastName,
      ),
      email: getValue(
        settings?.profile?.email,
        settings?.admin?.email,
        settings?.email,
        DEFAULT_PROFILE.email,
      ),
      phone: getValue(
        settings?.profile?.phone,
        settings?.admin?.phone,
        settings?.phone,
        DEFAULT_PROFILE.phone,
      ),
      image: getValue(
        settings?.profile?.image,
        settings?.admin?.image,
        settings?.image,
        DEFAULT_PROFILE.image,
      ),
    },
    store: {
      storeName: getValue(
        settings?.store?.storeName,
        settings?.storeName,
        DEFAULT_STORE.storeName,
      ),
      supportEmail: getValue(
        settings?.store?.supportEmail,
        settings?.supportEmail,
        DEFAULT_STORE.supportEmail,
      ),
      phone: getValue(
        settings?.store?.phone,
        settings?.storePhone,
        DEFAULT_STORE.phone,
      ),
      shippingFee: String(
        getValue(
          settings?.store?.shippingFee,
          settings?.shippingFee,
          DEFAULT_STORE.shippingFee,
        ),
      ),
      address: getValue(
        settings?.store?.address,
        settings?.address,
        DEFAULT_STORE.address,
      ),
      workingDays: getValue(
        settings?.store?.workingDays,
        settings?.workingDays,
        DEFAULT_STORE.workingDays,
      ),
    },
  };
}

export default function useAdminSettingsPage() {
  const { toast } = useToast();
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profileDraft, setProfileDraft] = useState({});
  const [storeDraft, setStoreDraft] = useState({});
  const [passwordForm, setPasswordForm] = useState(DEFAULT_PASSWORD_FORM);

  const {
    data: settings,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["AdminSettings"],
    queryFn: getAdminSettings,
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["AdminSettings"] });
    },
  });

  const { mutateAsync: updatePassword } = useMutation({
    mutationFn: updateAdminPassword,
    onSuccess: () => {
      toast({
        title: "Password updated successfully",
      });
      setPasswordForm(DEFAULT_PASSWORD_FORM);
    },
  });

  const { mutateAsync: updateStore } = useMutation({
    mutationFn: updateAdminStore,
    onSuccess: () => {
      toast({
        title: "Store updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["AdminSettings"] });
    },
  });

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const normalizedSettings = useMemo(
    () => normalizeSettings(settings),
    [settings],
  );

  const profileForm = useMemo(
    () => ({
      ...normalizedSettings.profile,
      ...profileDraft,
    }),
    [normalizedSettings.profile, profileDraft],
  );

  const storeForm = useMemo(
    () => ({
      ...normalizedSettings.store,
      ...storeDraft,
    }),
    [normalizedSettings.store, storeDraft],
  );

  const adminInitials = useMemo(
    () =>
      getInitials(
        profileForm.firstName,
        profileForm.lastName,
        profileForm.email,
      ),
    [profileForm.email, profileForm.firstName, profileForm.lastName],
  );

  const adminFullName =
    [profileForm.firstName, profileForm.lastName].filter(Boolean).join(" ") ||
    "Super Admin";

  const avatarSource = avatarPreview || profileForm.image || "";

  function updateProfileField(field, value) {
    setProfileDraft((currentProfileDraft) => ({
      ...currentProfileDraft,
      [field]: value,
    }));
  }

  function updateStoreField(field, value) {
    setStoreDraft((currentStoreDraft) => ({
      ...currentStoreDraft,
      [field]: value,
    }));
  }

  function updatePasswordField(field, value) {
    setPasswordForm((currentPasswordForm) => ({
      ...currentPasswordForm,
      [field]: value,
    }));
  }

  function handleAvatarButtonClick() {
    avatarInputRef.current?.click();
  }

  function handleAvatarChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    updateProfileField("image", selectedFile);
    setAvatarPreview(URL.createObjectURL(selectedFile));
  }

  return {
    settings,
    isLoading,
    isFetching,
    error,
    avatarInputRef,
    avatarSource,
    profileForm,
    storeForm,
    passwordForm,
    adminInitials,
    adminFullName,
    updateProfileField,
    updateStoreField,
    updatePasswordField,
    handleAvatarButtonClick,
    handleAvatarChange,
    updateProfile,
    updatePassword,
    updateStore,
  };
}
