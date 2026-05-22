import Icon from "@/system/icons/Icon";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Button from "@/components/genericComponents/Button";
export default function UserNestedRoutesHeader({
  className,
  iconName,
  title,
  info,
  buttonText,
  buttonIconName,
  onClick,
}) {
  return (
    <div
      className={twMerge(
        clsx(`rounded-xl border border-zinc-200 bg-white p-4 sm:p-6`, className),
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <Icon name={iconName} size={24} strokeWidth={1.5} variant="primary" />
          <div className="min-w-0 sm:flex sm:items-center sm:gap-3">
            <h2 className="text-lg font-light text-[#272727] sm:text-[21px]">
              {title}
            </h2>
            <span className="block text-sm text-zinc-500 sm:inline">
              ({info})
            </span>
          </div>
        </div>
        {buttonText && (
          <Button
            className="w-full tracking-wide sm:w-fit sm:text-base lg:text-xl"
            onClick={onClick}
          >
            <Icon
              name={buttonIconName}
              size={18}
              strokeWidth={1.5}
              variant="sourrounded"
            />
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
