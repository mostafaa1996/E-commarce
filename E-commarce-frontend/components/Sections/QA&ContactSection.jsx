import { contactData } from "../../src/Data/ContactData";
import ContactBlock from "../genericComponents/ContactBlock";
import InputField from "../genericComponents/InputField";
import TextArea from "../genericComponents/TextArea";
import Button from "../genericComponents/Button";
export default function QAandContactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-16
          "
        >
          {/* Left: Contact info */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
                {contactData.title}
              </h2>

              <p className="mt-2 text-[21px] font-light text-zinc-500">
                {contactData.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {contactData.blocks.map((block) => (
                <ContactBlock key={block.title} {...block} />
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
                {contactData.formTitle}
              </h2>

              <p className="mt-2 text-[21px] font-light text-zinc-500">
                {contactData.formSubtitle}
              </p>
            </div>

            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField placeholder="Your full name *" />
                <InputField placeholder="Phone number" />
              </div>

              <InputField placeholder="Write your email here *" type="email" />
              <InputField placeholder="Write your subject here" />
              <TextArea placeholder="Write your message here *" />

              <Button type="submit" className="w-fit tracking-widest">
                SUBMIT
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
