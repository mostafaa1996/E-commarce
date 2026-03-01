import ProfileCard from "@/components/ProfileCard/profileCard";
import Avatar from "@/components/ProfileCard/Avatar";
import ProfileInfo from "@/components/ProfileCard/ProfileInfo";
import { shortenText } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
export default function UserProfileCard({ user }) {
  const navigate = useNavigate();
  function onEdit() {
    navigate("/profile/edit-profile");
  }
  return (
    <ProfileCard className={`w-full`}>
      {/* Left side */}
      <div className="flex items-start gap-6">
        <Avatar src={user.avatar || "/Man_avatar.png"} alt={user.name} />
        <ProfileInfo
          name={user.name}
          memberSince={user.memberSince || "--/--/--"}
          email={shortenText(user.email, 19)}
          phone={user.phone}
          location={user.city + ", " + user.country}
        />
      </div>

      {/* Right side */}
      <button
        onClick={onEdit}
        className={`border border-zinc-300 px-2 py-2 rounded-lg text-sm
        font-light hover:bg-zinc-50 transition-all duration-300 ease-in
        cursor-pointer active:scale-120 
        `}
      >
        Edit Profile
      </button>
    </ProfileCard>
  );
}
