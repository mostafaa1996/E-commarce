import StatCard from "../../../components/StatsCard/StatCard";
export default function StatsGrid({ stats }) {
  return (
    <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
}