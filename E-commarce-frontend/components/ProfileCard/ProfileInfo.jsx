import ContactItem from "./ContactItem";
export default function ProfileInfo({
  name,
  memberSince,
  email,
  phone,
  location,
}) {
  return (
    <div className="flex flex-col">
      <h2 className="text-[21px] font-light text-[#272727]">{name}</h2>
      <span className="text-sm text-zinc-500">Member since {memberSince}</span>
      <div className="flex flex-wrap gap-6 mt-2">
        <ContactItem icon="✉️">{email}</ContactItem>
        <ContactItem icon="📞">{phone}</ContactItem>
        <ContactItem icon="📍">{location}</ContactItem>
      </div>
    </div>
  );
}
