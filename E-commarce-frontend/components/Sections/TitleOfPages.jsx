export default function TitleOfPages({Title, prevPage}){
    return(
        <section className="w-full flex flex-col items-center bg-[#f5f5f5] md:py-16 py-8">
          <h1 className="uppercase text-[#272727] font-extralight sm:text-[60px] text-[40px]">
            {Title}
          </h1>
        </section>
    );
}