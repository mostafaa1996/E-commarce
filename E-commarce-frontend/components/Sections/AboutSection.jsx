import VideoBlock from "../genericComponents/videoBlock";
import ContentBlock from "../genericComponents/About_content";
import aboutData from "../../src/Data/AboutData";
export default function MediaContentSection() {
  return (
    <section className="w-full flex items-center justify-center py-20 bg-white">
      <div className="max-w-7xl">
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-20
            items-center
          "
        >
          <VideoBlock image={aboutData.image} onPlay={() => {}} />

          <ContentBlock
            title={aboutData.title}
            paragraphs={aboutData.paragraphs}
            cta={aboutData.cta}
          />
        </div>
      </div>
    </section>
  );
}
