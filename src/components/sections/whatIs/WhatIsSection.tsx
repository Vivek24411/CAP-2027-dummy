import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getWhatIs } from "@/controllers/content";
import { StatsBand } from "./StatsBand";
import { VideoPlayer } from "./VideoPlayer";
import { WhatIsStoryInteractive } from "./WhatIsStoryInteractive";

// Order, top to bottom: heading → video → numbers band → story + logo diagram that builds
// with the scroll (WhatIsStoryInteractive, which also shows the closing paragraph).
export async function WhatIsSection() {
  const content = await getWhatIs();

  return (
    <section id="what-is" aria-labelledby="what-is-heading" className="pt-section">
      <Container>
        <SectionHeading id="what-is-heading" heading={content.heading} glow />
        <div className="mt-12 md:mt-20">
          <VideoPlayer video={content.video} />
        </div>
      </Container>

      <div className="mt-14 md:mt-[3.7rem]">
        <StatsBand stats={content.stats} />
      </div>

      {/* Story + logo: the story fades out as the logo glides to the centre and the
          arcs, labels and closing paragraph build around it (scroll-driven, sticky). */}
      <div className="mt-4 md:mt-5">
        <WhatIsStoryInteractive content={content} />
      </div>
    </section>
  );
}
