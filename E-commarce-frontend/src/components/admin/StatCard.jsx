import { cn } from "@/utils/utils";
import Icon from "@/system/icons/Icon";

export function StatCard({ title, value, change, changeType = "neutral", iconName , iconBg }) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === "up" && "text-success",
              changeType === "down" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {changeType === "up" ? "↑" : changeType === "down" ? "↓" : ""} {change}
            </p>
          )}
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", iconBg || "bg-primary/10")}>
          <Icon name={iconName} className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
