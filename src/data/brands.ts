import type { BrandsContent } from "@/models/brand";

// Placeholder partners from the Figma file — replace with the confirmed sponsors.
export const brands: BrandsContent = {
  heading: { accent: "Trusted by", title: "Leading brands" },
  items: Array.from({ length: 5 }, (_, i) => ({
    id: `brand-${i + 1}`,
    name: "coreops.ai",
    label: "XYZ Partner",
    logo: "/images/brands/coreops.png",
  })),
};
