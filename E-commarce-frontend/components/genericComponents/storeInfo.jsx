export default function StoreLocation({ country, address, phone, email }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[21px] font-light text-[#272727] uppercase tracking-wide">
        {country}
      </h4>

      <p className="text-[16px] font-light text-zinc-500 leading-relaxed">
        {address}
      </p>

      <p className="text-[16px] font-light text-zinc-500">
        {phone}
      </p>

      <p className="text-[16px] font-light text-zinc-500">
        {email}
      </p>
    </div>
  );
}
