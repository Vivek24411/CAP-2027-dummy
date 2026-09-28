import { RevealGroup } from "@/components/motion/RevealGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEarnCoins } from "@/controllers/content";
import { CoinGroup } from "./CoinGroup";

export async function EarnCoinsSection() {
  const content = await getEarnCoins();

  return (
    <section
      id="rewards"
      aria-labelledby="rewards-heading"
      className="py-section relative isolate overflow-hidden"
    >
      <div className="relative mx-auto max-w-[90rem] px-4">
        {/* Coin groups sit behind the text, one against each edge */}
        <CoinGroup
          image={content.coinsLeft}
          side="left"
          className="top-28 left-2 -z-10 w-[min(34.5rem,38vw)] md:top-0 md:left-9"
        />
        <CoinGroup
          image={content.coinsRight}
          side="right"
          className="top-28 right-2 -z-10 w-[min(34.5rem,38vw)] md:top-0 md:right-9"
        />

        <SectionHeading id="rewards-heading" heading={content.heading} className="pt-2" />

        <RevealGroup>
          <p
            data-reveal="fade-up"
            className="text-secondary mx-auto mt-40 max-w-[60ch] text-center text-[1.0625rem] leading-[1.6] md:mt-[clamp(3rem,calc(29.4vw-3rem),22rem)] md:text-xl"
          >
            {content.description}
          </p>
        </RevealGroup>
      </div>
    </section>
  );
}
