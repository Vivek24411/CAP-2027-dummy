import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRoles } from "@/controllers/content";
import { ProcessStep } from "./ProcessStep";
import { ProcessTimeline } from "./ProcessTimeline";

// "Your role in the movement" — shown as the step-by-step process the navbar's "Process"
// and the footer's "How it works?" links point to (hence id="process").
export async function RolesSection() {
  const { heading, items } = await getRoles();

  return (
    <section id="process" aria-labelledby="process-heading" className="py-section">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="process-heading" heading={heading} align="start" />
        </div>

        <ProcessTimeline>
          <ol className="relative">
            {items.map((role, index) => (
              <ProcessStep key={role.id} role={role} number={String(index + 1).padStart(2, "0")} />
            ))}
          </ol>
        </ProcessTimeline>
      </Container>
    </section>
  );
}
