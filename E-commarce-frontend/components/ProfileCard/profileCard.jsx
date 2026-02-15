import clsx from "clsx";
export default function ProfileCard({ children , className }) {
  return (
    <div
      className={clsx(`w-full border border-zinc-200 rounded-xl bg-white
        p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between
        gap-6`, className)}
      
    >
      {children}
    </div>
  );
}
