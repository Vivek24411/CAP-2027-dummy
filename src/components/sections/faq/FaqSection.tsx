import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqs } from "@/controllers/content";
import { FaqAccordion } from "./FaqAccordion";

export async function FaqSection() {
  const { heading, items } = await getFaqs();

  return (
    <section id="faqs" aria-labelledby="faqs-heading" className="py-section">
      <Container>
        <SectionHeading id="faqs-heading" heading={heading} layout="inline" />

        <div className="mx-auto mt-12 max-w-3xl md:mt-20">
          <FaqAccordion items={items} />
        </div>
      </Container>
    </section>
  );
}
