export default function Loading({
  message = "Loading...",
  className = "",
  fullPage = false,
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullPage ? "min-h-[60vh]" : ""
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-orange-100 bg-white/90 px-10 py-8 shadow-[0_20px_60px_rgba(249,115,22,0.14)] backdrop-blur">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-orange-100/80 via-white to-amber-50" />
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-orange-100" />
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-400" />
          <div className="h-8 w-8 rounded-full bg-orange-500/10 shadow-inner" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
            {message}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we prepare your data.
          </p>
        </div>
      </div>
    </div>
  );
}
