import Icon from "@/system/icons/Icon";
export default function ContactItem({ iconName, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500">
      <Icon name={iconName} size={16} variant="muted" />
      {children}
    </div>
  );
}
