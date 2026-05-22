import ProfileCard from "@/components/ProfileCard/profileCard";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPersonalInfo, UploadProfileImage } from "@/APIs/UserProfileService";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import Avatar from "@/components/ProfileCard/Avatar";
import Button from "@/components/genericComponents/Button";
import ProfileForm from "@/Sections/UserProfile/EditProfileForm";
import Man_avatar from "/Man_avatar.png";
import Icon from "@/system/icons/Icon";
import { queryClient } from "../queryClient";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function EditUserProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile-edit"],
    queryFn: getPersonalInfo,
  });

  
  const { mutate } = useMutation({
    mutationFn: UploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-edit"] });
    },
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  function handleOpenFileDialog() {
    fileInputRef.current.click();
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    mutate(formData);
    event.target.value = null;
  }

  return (
    <>
      <BaseSection>
        <ProfileCard
          className="h-fit max-w-7xl justify-center gap-1 lg:flex-col lg:items-start"
        >
          <h1 className="text-2xl font-bold sm:text-3xl">Edit Profile</h1>
          <p className="text-zinc-400 text-sm">
            Update your personal information
          </p>
        </ProfileCard>
        <ProfileCard
          className="h-fit max-w-7xl justify-center gap-0 lg:flex-col lg:items-start"
        >
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:justify-center sm:gap-0">
              <h1 className="text-md hidden sm:mb-4 sm:block">Profile Photo</h1>
              <Avatar
                src={data.avatar.url ||Man_avatar}
                alt="Man"
                onClick={handleOpenFileDialog}
              />
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
              accept="image/png, image/jpeg, image/svg+xml, image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </ProfileCard>
        <ProfileForm className="max-w-7xl" data={data}/>
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
