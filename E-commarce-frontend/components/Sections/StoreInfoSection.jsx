import ContactBlock from "../genericComponents/ContactBlock";
import { storesData } from "../../src/Data/storeInfo";
export default function StoresSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-14
            items-center
          "
        >
          {/* Image */}
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100">
            <img
              src={storesData.image}
              alt="Store setup"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
                {storesData.title}
              </h2>

              <p className="mt-2 text-[21px] font-light text-zinc-500">
                {storesData.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {storesData.locations.map((location) => (
                <ContactBlock key={location.country} {...location} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
