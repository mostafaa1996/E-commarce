import ProfileCard from "@/components/ProfileCard/profileCard";
import { useQuery } from "@tanstack/react-query";
import { getPersonalInfo } from "@/APIs/UserProfileService";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/adminUI/avatar";
import Button from "@/components/genericComponents/Button";
import ProfileForm from "@/Sections/UserProfile/EditProfileForm";
import Icon from "@/system/icons/Icon";

import { useRef, useMemo, useState, useEffect } from "react";
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

export default function EditUserProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile-edit"],
    queryFn: getPersonalInfo,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!data) return;
    setAvatarPreview(data?.avatar?.url);
  }, [data]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const UserInitials = useMemo(
    () => getInitials(data?.firstName, data?.lastName, data?.email),
    [data?.email, data?.firstName, data?.lastName],
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  function handleOpenFileDialog() {
    fileInputRef.current.click();
  }

  function handleAvatarChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(selectedFile));
  }

  return (
    <>
      <BaseSection>
        <ProfileCard className="h-fit max-w-7xl justify-center gap-1 lg:flex-col lg:items-start">
          <h1 className="text-2xl font-bold sm:text-3xl">Edit Profile</h1>
          <p className="text-zinc-400 text-sm">
            Update your personal information
          </p>
        </ProfileCard>
        <ProfileCard className="h-fit max-w-7xl justify-center gap-0 lg:flex-col lg:items-start">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:justify-center sm:gap-0">
              <h1 className="text-md hidden sm:mb-4 sm:block">Profile Photo</h1>
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarPreview}
                  alt={data?.firstName || "Man"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {UserInitials}
                </AvatarFallback>
              </Avatar>
              <div className="sm:hidden">
                <h1 className="text-base font-medium text-[#272727]">
                  Profile Photo
                </h1>
                <p className="text-sm text-zinc-400">Tap photo to change</p>
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <h1 className="text-md hidden sm:block">Upload New Photo</h1>
              <p className="text-zinc-400 text-sm">
                JPG, PNG, SVG, GIF (MAX. 800x800px)
              </p>
              <Button
                className="mt-3 w-full rounded-md py-2 text-sm sm:w-fit lg:text-[15px]"
                onClick={handleOpenFileDialog}
              >
                Upload Photo
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              form="profile-form"
              name="avatar"
              accept="image/png, image/jpeg, image/svg+xml, image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </ProfileCard>
        <ProfileForm className="max-w-7xl" data={data} id="profile-form" />
        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-5">
          <Button
            className="w-full rounded-md py-2 text-sm sm:w-fit"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            className="w-full rounded-md py-2 text-sm sm:w-fit"
            type="submit"
            form="profile-form"
          >
            <Icon name="save" variant="surrounded" size={18} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </BaseSection>
    </>
  );
}
