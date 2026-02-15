export default function ContactItem({ icon, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500">
      <span className="text-zinc-400">{icon}</span>
      {children}
    </div>
  );
}