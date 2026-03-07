export default function ProcessStatus({ status , statusColor}) {
  
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-light
        ${statusColor || "bg-zinc-100 text-zinc-600"}
      `}
    >
      {status === "transit" ? "In Transit" : status}
    </span>
  );
}
