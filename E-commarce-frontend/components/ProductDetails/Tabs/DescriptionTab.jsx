export default function DescriptionTab({ text, bullets }) {
  return (
    <div className="flex flex-col gap-6 text-sm text-zinc-500 leading-relaxed m-8 p-4 border-b border-zinc-200">
      <p className="pb-2 text-xl underline">Product Description</p>
      <p>{text}</p>

      <ul className="list-disc pl-5 space-y-1 ml-9">
        {bullets.map((item, index) => (
          <li key={`Product-Details-Description-Tab-Bullet-${index}`}>
            {item}
          </li>
        ))}
      </ul>

      <p>{text}</p>
    </div>
  );
}
