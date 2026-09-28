import { AboutSection } from "@/components/sections/about/AboutSection";
import { BrandsSection } from "@/components/sections/brands/BrandsSection";
import { EarnCoinsSection } from "@/components/sections/earnCoins/EarnCoinsSection";
import { FaqSection } from "@/components/sections/faq/FaqSection";
import { HeroSection } from "@/components/sections/hero/HeroSection";
import { RolesSection } from "@/components/sections/roles/RolesSection";
import { ShowcaseSection } from "@/components/sections/showcase/ShowcaseSection";
import { TestimonialsSection } from "@/components/sections/testimonials/TestimonialsSection";
import { WhatIsSection } from "@/components/sections/whatIs/WhatIsSection";
import { WhyCapSection } from "@/components/sections/whyCap/WhyCapSection";

// Every section of the design, top to bottom.
export default function Home() {
  return (
    <>
      <HeroSection />
      <WhatIsSection />
      <WhyCapSection />
      <EarnCoinsSection />
      <ShowcaseSection />
      <RolesSection />
      <BrandsSection />
      <TestimonialsSection />
      <FaqSection />
      <AboutSection />
    </>
  );
}
