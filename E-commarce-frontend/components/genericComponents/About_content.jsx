import Button from "./Button"

export default function ContentBlock({ title, paragraphs, cta }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
        {title}
      </h2>

      {paragraphs.map((text, index) => (
        <p
          key={index}
          className="text-[21px] font-light text-zinc-500 leading-relaxed"
        >
          {text}
        </p>
      ))}

      <Button>{cta}</Button>
    </div>
  );
}
