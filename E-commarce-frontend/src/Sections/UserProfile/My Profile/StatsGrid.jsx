import StatCard from "@/components/StatsCard/StatCard";
export default function StatsGrid({ stats }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {stats?.map((stat) => (
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
