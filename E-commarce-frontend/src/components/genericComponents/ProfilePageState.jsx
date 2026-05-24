import { AlertCircle } from "lucide-react";
import Loading from "@/components/genericComponents/Loading";

export default function ProfilePageState({
  type,
  title,
  message,
  loadingMessage = "Loading profile",
}) {
  if (type === "loading") {
    return <Loading message={loadingMessage} fullPage />;
  }

  if (type === "error") {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{title || "Error"}</p>
            <p className="text-sm">
              {message || "Something went wrong while loading this page."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
      <p className="font-semibold text-[#272727]">{title || "No data found"}</p>
      {message && <p className="mt-2 text-sm text-zinc-500">{message}</p>}
    </div>
  );
}
