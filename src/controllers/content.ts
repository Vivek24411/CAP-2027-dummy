import { about } from "@/data/about";
import { brands } from "@/data/brands";
import { earnCoins } from "@/data/earnCoins";
import { faqs } from "@/data/faqs";
import { footer } from "@/data/footer";
import { hero } from "@/data/hero";
import { navigation } from "@/data/navigation";
import { roles } from "@/data/roles";
import { showcase } from "@/data/showcase";
import { testimonials } from "@/data/testimonials";
import { whatIs } from "@/data/whatIs";
import { whyCap } from "@/data/whyCap";
import type { AboutContent } from "@/models/about";
import type { BrandsContent } from "@/models/brand";
import type { EarnCoinsContent } from "@/models/earnCoins";
import type { FaqContent } from "@/models/faq";
import type { FooterContent } from "@/models/footer";
import type { HeroContent } from "@/models/hero";
import type { Navigation } from "@/models/navigation";
import type { RolesContent } from "@/models/role";
import type { Showcase } from "@/models/showcase";
import type { TestimonialsContent } from "@/models/testimonial";
import type { WhatIsContent } from "@/models/whatIs";
import type { WhyCapContent } from "@/models/whyCap";

// Views get their content only through these functions. They read static data today;
// when a CMS or backend exists, change the body here and no component needs to change.

export async function getNavigation(): Promise<Navigation> {
  return navigation;
}

export async function getHero(): Promise<HeroContent> {
  return hero;
}

export async function getWhatIs(): Promise<WhatIsContent> {
  return whatIs;
}

export async function getWhyCap(): Promise<WhyCapContent> {
  return whyCap;
}

export async function getEarnCoins(): Promise<EarnCoinsContent> {
  return earnCoins;
}

export async function getShowcase(): Promise<Showcase> {
  return showcase;
}

export async function getRoles(): Promise<RolesContent> {
  return roles;
}

export async function getBrands(): Promise<BrandsContent> {
  return brands;
}

export async function getTestimonials(): Promise<TestimonialsContent> {
  return testimonials;
}

export async function getFaqs(): Promise<FaqContent> {
  return faqs;
}

export async function getAbout(): Promise<AboutContent> {
  return about;
}

export async function getFooter(): Promise<FooterContent> {
  return footer;
}

// Splits testimonials into rows for the marquee, alternating so neighbouring rows differ.
export function splitIntoRows<T>(items: T[], rows: number): T[][] {
  return Array.from({ length: rows }, (_, row) => items.filter((_, i) => i % rows === row));
}
