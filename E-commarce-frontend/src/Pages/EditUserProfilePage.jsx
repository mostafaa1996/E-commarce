import ProfileCard from "@/components/ProfileCard/profileCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPersonalInfo, UploadProfileImage } from "@/APIs/UserProfileService";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import Avatar from "@/components/ProfileCard/Avatar";
import Button from "@/components/genericComponents/Button";
import ProfileForm from "@/Sections/UserProfile/EditProfileForm";
import Man_avatar from "/Man_avatar.png";
import Icon from "@/system/icons/Icon";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function EditUserProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getPersonalInfo,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: UploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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
          className={`max-w-7xl lg:flex-col lg:items-start justify-center gap-0 h-fit`}
        >
          <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
          <p className="text-zinc-400 text-sm">
            Update your personal information
          </p>
        </ProfileCard>
        <ProfileCard
          className={`max-w-7xl lg:flex-col lg:items-start justify-center gap-0 h-fit`}
        >
          <div className="flex flex-row items-end gap-5">
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-md mb-4">Profile Photo</h1>
              <Avatar
                src={data.avatar.url ||Man_avatar}
                alt="Man"
                onClick={handleOpenFileDialog}
              />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-md ">Upload New Photo</h1>
              <p className="text-zinc-400 text-sm">
                JPG, PNG, SVG, GIF (MAX. 800x800px)
              </p>
              <Button
                className="lg:text-[15px] rounded-md"
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
        <div className="flex flex-row items-center justify-end gap-5">
          <Button className="rounded-md" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button className="rounded-md" type="submit" form="profile-form">
            <Icon name="save" variant="surrounded" size={18} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </BaseSection>
    </>
  );
}
