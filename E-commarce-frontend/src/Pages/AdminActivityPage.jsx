import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { cn } from "@/utils/utils";
import Loading from "@/components/genericComponents/Loading";
import useAdminActivityPage from "@/hooks/useAdminActivityPage";

export default function AdminActivityPage() {
  let content = null;
  const { logs, isLoading, error, getActivityMeta, formatRelativeTime } =
    useAdminActivityPage();

  if (isLoading) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Activity Log"
          description="Loading your activities."
          breadcrumbs={[{ label: "Activity Log" }]}
        />
        <Loading message="Loading Activities" fullPage />
      </AdminLayout>
    );
  }

  if (error) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Activity Log"
          description="We could not load your activities right now."
          breadcrumbs={[{ label: "Activity Log" }]}
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load data.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (logs) {
    content = (
      <AdminLayout>
        <PageHeader
          title="Activity Log"
          description="Track all admin actions and system events"
          breadcrumbs={[
            { label: "Dashboard", href: "/profile/admin/dashboard" },
            { label: "Activity Log" },
          ]}
        />

        <div className="bg-card rounded-xl border shadow-sm">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[29px] top-0 bottom-0 w-px bg-border" />

            {logs.map((activity, i) => {
              const matchedActivityType = getActivityMeta(activity.type);
              const ActivityIcon = matchedActivityType.icon;
              const activityColor =
                matchedActivityType?.color || "bg-muted text-muted-foreground";

              return (
                <div
                  key={i}
                  className="relative flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 z-10",
                      activityColor,
                    )}
                  >
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      by {activity.actorRole}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return content;
}
