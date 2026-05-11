import { Label } from "@/components/genericComponents/Label";

export default function ContactField({
  label,
  required,
  error,
  hint,
  children,
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-primary">*</span>}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div
        className={
          error
            ? "[&_input]:border-destructive [&_textarea]:border-destructive"
            : ""
        }
      >
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
