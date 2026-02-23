import TopFixedLayer from "@/Sections/TopLayer/TopFixedLayer";
import BottomLayer from "@/Sections/BottomLayer/BottomLayer";
import ProfileCard from "@/components/ProfileCard/profileCard";
import UserSidebar from "@/Sections/UserProfile/UserSideBar";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileData } from "@/APIs/UserProfileService";
import { UserSideBarItems } from "@/system/Data/UserSideBarData";
import Avatar from "@/components/ProfileCard/Avatar";
import Button from "@/components/genericComponents/Button";
import ProfileForm from "@/Sections/UserProfile/EditProfileForm";
import Man_avatar from "/Man_avatar.png";
import Icon from "@/system/icons/Icon";

export default function EditUserProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfileData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  return (
    <>
      <TopFixedLayer Title="Profile" />
      <div className="grid lg:grid-cols-6 grid-cols-1 m-10 gap-3">
        <div className="hidden lg:block lg:col-span-1"></div>
        <UserSidebar items={UserSideBarItems} activeId="profile" />
        <div className="flex flex-col gap-5 lg:col-span-3">
          <ProfileCard
            className={`max-w-5xl lg:flex-col lg:items-start justify-center gap-0 h-fit`}
          >
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <p className="text-zinc-400 text-sm">
              Update your personal information
            </p>
          </ProfileCard>
          <ProfileCard
            className={`max-w-5xl lg:flex-col lg:items-start justify-center gap-0 h-fit`}
          >
            <div className="flex flex-row items-end gap-5">
              <div className="flex flex-col items-start justify-center">
                <h1 className="text-md mb-4">Profile Photo</h1>
                <Avatar src={Man_avatar} alt="Man" />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-md ">Upload New Photo</h1>
                <p className="text-zinc-400 text-sm">
                  JPG, PNG, SVG, GIF (MAX. 800x800px)
                </p>
                <Button className="lg:text-[14px]">Upload Photo</Button>
              </div>
            </div>
          </ProfileCard>
          <ProfileForm />
          <div className="flex flex-row items-center justify-end gap-5">
            <Button className="lg:text-[14px]">Cancel</Button>
            <Button className="lg:text-[14px]">
              <Icon
                name="save"
                variant="surrounded"
                size={18}
                className="mr-2"
              />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <BottomLayer />
    </>
  );
}
