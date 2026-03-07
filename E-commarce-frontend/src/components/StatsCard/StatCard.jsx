export default function StatCard({ icon, value, label }) {
  return (
    <div
      className={`border border-zinc-200 rounded-xl p-6 bg-white flex flex-col
        items-center justify-center text-center gap-3 transition hover:shadow-md
        `}
    >
      <div className="text-[#FF6543] text-xl">{icon}</div>
      <span className="text-[21px] font-light text-[#272727]">{value}</span>
      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  );
}
