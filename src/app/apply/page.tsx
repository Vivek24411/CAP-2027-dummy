import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Apply",
};

// TODO: Build the Apply page.
export default function ApplyPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold">Apply</h1>
      <p className="text-foreground/70 mt-4">Coming soon.</p>
    </Container>
  );
}
