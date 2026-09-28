import Image from "next/image";
import { ScrollZoom } from "@/components/motion/ScrollZoom";
import { getShowcase } from "@/controllers/content";
import { RegisterStrip } from "./RegisterStrip";

// Rewards artwork → scrolling register strip → E-Summit stage photo, stacked edge to edge.
// The stage photo eases out of a slow zoom as it scrolls into view.
export async function ShowcaseSection() {
  const { rewards, banner, stage } = await getShowcase();

  return (
    <section aria-label="Rewards and registration">
      <Image
        src={rewards.src}
        alt={rewards.alt}
        width={rewards.width}
        height={rewards.height}
        sizes="(min-width: 1440px) 1440px, 100vw"
        className="mx-auto h-auto w-full max-w-[90rem]"
      />

      <RegisterStrip banner={banner} />

      <ScrollZoom>
        <Image
          src={stage.src}
          alt={stage.alt}
          width={stage.width}
          height={stage.height}
          sizes="100vw"
          className="h-auto w-full"
        />
      </ScrollZoom>
    </section>
  );
}
