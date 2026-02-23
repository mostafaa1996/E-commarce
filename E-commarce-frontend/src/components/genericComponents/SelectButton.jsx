export default function SelectButton({type , name, label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type={type}
        name= {name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-[#FF6543] w-4 h-4"
      />
      <span className="text-[16px] font-light text-zinc-600">
        {label}
      </span>
    </label>
  );
}