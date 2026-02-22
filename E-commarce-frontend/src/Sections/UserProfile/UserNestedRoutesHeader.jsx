import Icon from "../../system/icons/Icon";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Button from "../../../components/genericComponents/Button";
export default function UserNestedRoutesHeader({
  className,
  iconName,
  title,
  info,
  button,
  buttonIconName,
  onClick,
}) {
  return (
    <div
      className={twMerge(
        clsx(`border border-zinc-200 rounded-xl bg-white p-6`, className),
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name={iconName} size={24} strokeWidth={1.5} variant="primary" />
          <h2 className="text-[21px] font-light text-[#272727]">{title}</h2>
          <span className="text-sm text-zinc-500">({info})</span>
        </div>
        {button && (
          <Button
            className="mx-4 lg:text-[12px] tracking-widest"
            onClick={onClick}
          >
            <Icon
              name={buttonIconName}
              size={18}
              strokeWidth={1.5}
              variant="sourrounded"
            />
            {button}
          </Button>
        )}
      </div>
    </div>
  );
}
