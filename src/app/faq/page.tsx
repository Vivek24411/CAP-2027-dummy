import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "FAQ",
};

// TODO: Build the FAQ page.
export default function FAQPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold">FAQ</h1>
      <p className="text-foreground/70 mt-4">Coming soon.</p>
    </Container>
  );
}
