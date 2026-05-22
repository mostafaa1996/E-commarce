import ContactItem from "./ContactItem";
export default function ProfileInfo({
  name,
  memberSince,
  email,
  phone,
  location,
}) {
  return (
    <div className="min-w-0 flex flex-col">
      <h2 className="line-clamp-1 text-lg font-light text-[#272727] sm:text-[21px]">{name}</h2>
      <span className="text-sm text-zinc-500">Member since {memberSince}</span>
      <div className="flex flex-wrap gap-2 mt-2 ">
        <ContactItem iconName="mail">{email}</ContactItem>
        <ContactItem iconName="phone">{phone}</ContactItem>
        <ContactItem iconName="location">{location}</ContactItem>
      </div>
    </div>
  );
}
