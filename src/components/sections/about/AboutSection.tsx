import { RevealGroup } from "@/components/motion/RevealGroup";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAbout } from "@/controllers/content";
import { AboutCard } from "./AboutCard";
import { ContactCard } from "./ContactCard";

export async function AboutSection() {
  const about = await getAbout();

  return (
    <section id="about" aria-labelledby="about-heading" className="py-section">
      <Container>
        <SectionHeading id="about-heading" heading={about.heading} layout="inline" />

        <div className="mt-12 grid items-center gap-12 md:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <RevealGroup className="grid grid-cols-3 gap-3 md:gap-5">
            {about.cards.map((card) => (
              // The wrapper fades in; the card inside keeps its own hover lift.
              <div key={card.id} data-reveal="fade-up">
                {card.contact ? <ContactCard contact={card.contact} /> : <AboutCard />}
              </div>
            ))}
          </RevealGroup>

          <div className="flex flex-col gap-6">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body-lg text-secondary measure">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
