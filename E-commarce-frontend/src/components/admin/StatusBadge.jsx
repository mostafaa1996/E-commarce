import { Badge } from "@/components/genericComponents/badge";
import { cn } from "@/utils/utils";

// type StatusType = "success" | "warning" | "danger" | "info" | "default" | "pending";

const statusStyles = {
  success: "bg-success/10 text-success border-success/20 hover:bg-success/15",
  warning: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/15",
  danger: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
  info: "bg-info/10 text-info border-info/20 hover:bg-info/15",
  pending: "bg-muted text-muted-foreground border-muted hover:bg-muted/80",
  default: "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80",
};

export function StatusBadge({ status, children, className }) {
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", statusStyles[status], className)}>
      {children}
    </Badge>
  );
}
