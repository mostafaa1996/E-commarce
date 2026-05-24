import { getPersonalInfo } from "@/APIs/UserProfileService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function useEditUserProfilePage() {
  const profileQuery = useQuery({
    queryKey: ["profile-edit"],
    queryFn: getPersonalInfo,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const avatarPreview =
    avatarPreviewUrl || profileQuery.data?.avatar?.url || "";

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const userInitials = useMemo(
    () =>
      getInitials(
        profileQuery.data?.firstName,
        profileQuery.data?.lastName,
        profileQuery.data?.email,
      ),
    [
      profileQuery.data?.email,
      profileQuery.data?.firstName,
      profileQuery.data?.lastName,
    ],
  );

  function handleOpenFileDialog() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (avatarPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setAvatarPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function handleCancel() {
    navigate(-1);
  }

  return {
    data: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    fileInputRef,
    avatarPreview,
    userInitials,
    handleOpenFileDialog,
    handleAvatarChange,
    handleCancel,
  };
}
