import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBrands } from "@/controllers/content";
import { BrandCard } from "./BrandCard";
import { BrandsGrid } from "./BrandsGrid";

// Cards wrap 3 per row on desktop (the last row centres, giving the 3 + 2 layout),
// 2 per row below that.
const cardWidth = "w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]";

export async function BrandsSection() {
  const { heading, items } = await getBrands();

  return (
    <section id="partners" aria-labelledby="partners-heading" className="py-section">
      <Container>
        <SectionHeading id="partners-heading" heading={heading} />

        <BrandsGrid className="group/grid mt-12 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-8 md:mt-20 md:gap-y-10">
          {items.map((brand) => (
            <li key={brand.id} className={cardWidth}>
              <BrandCard brand={brand} />
            </li>
          ))}
        </BrandsGrid>
      </Container>
    </section>
  );
}
