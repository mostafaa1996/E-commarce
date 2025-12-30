export default function PaymentMethod({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        name="payment"
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-[#FF6543]"
      />
      <span className="text-[16px] font-light text-zinc-600">
        {label}
      </span>
    </label>
  );
}