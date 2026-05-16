import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/utils/utils";

const CheckBox = React.forwardRef(function Checkbox(
  { className, ...props },
  ref,
) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer grid h-4 w-4 shrink-0 place-content-center rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("grid place-content-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

CheckBox.displayName = CheckboxPrimitive.Root.displayName;

export { CheckBox };
