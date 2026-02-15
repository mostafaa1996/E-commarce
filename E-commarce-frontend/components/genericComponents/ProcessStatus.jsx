export default function ProcessStatus({ status }) {
  const styles = {
    delivered: "bg-green-100 text-green-600",
    transit: "bg-yellow-100 text-yellow-600",
    cancelled: "bg-red-100 text-red-600",
    default: "bg-[#FF6543] text-white",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-light
        ${styles[status] || "bg-zinc-100 text-zinc-600"}
      `}
    >
      {status === "transit" ? "In Transit" : status}
    </span>
  );
}
