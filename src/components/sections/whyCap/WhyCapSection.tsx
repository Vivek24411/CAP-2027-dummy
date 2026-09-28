import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getWhyCap } from "@/controllers/content";
import { BenefitCard } from "./BenefitCard";
import { BenefitsReveal } from "./BenefitsReveal";

export async function WhyCapSection() {
  const { heading, benefits } = await getWhyCap();

  return (
    <section id="benefits" aria-labelledby="benefits-heading" className="py-section">
      <Container>
        <SectionHeading id="benefits-heading" heading={heading} layout="inline" glow />

        <BenefitsReveal className="mt-12 flex flex-col gap-6 md:mt-20 md:gap-8">
          {benefits.map((benefit, index) => (
            <li key={benefit.id}>
              <BenefitCard
                benefit={benefit}
                index={index}
                total={benefits.length}
                imageRight={index % 2 === 1}
              />
            </li>
          ))}
        </BenefitsReveal>
      </Container>
    </section>
  );
}
