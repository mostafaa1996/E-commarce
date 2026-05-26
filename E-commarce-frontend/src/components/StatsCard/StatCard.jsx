export default function StatCard({ icon, value, label }) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-zinc-200 bg-white p-4 sm:p-6
        items-center justify-center text-center gap-3 transition hover:shadow-md
        `}
    >
      <div className="text-[#FF6543] text-xl">{icon}</div>
      <span className="break-all text-lg font-light text-[#272727] sm:text-[21px]">{value}</span>
      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  );
}
