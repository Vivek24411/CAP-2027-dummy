import type { Role } from "@/models/role";

// One step on the vertical timeline. The dot sits over the timeline's line; the classes
// here are the lit ("reached") state — globals.css dims steps the line hasn't reached yet.
export function ProcessStep({ role, number }: { role: Role; number: string }) {
  return (
    <li data-step className="relative pb-12 pl-12 last:pb-0 md:pb-16 md:pl-16">
      <span
        data-step-dot
        aria-hidden="true"
        className="border-accent bg-background absolute top-0.5 left-0 grid size-6 place-items-center rounded-full border transition-colors duration-300"
      >
        <span className="bg-accent size-2 rounded-full transition-colors duration-300" />
      </span>
      <p aria-hidden="true" className="text-muted text-sm tabular-nums">
        {number}
      </p>
      <h3
        data-step-title
        className="text-foreground mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] transition-colors duration-300 md:text-[1.75rem]"
      >
        {role.title}
      </h3>
      <p
        data-step-text
        className="text-body-lg text-secondary measure mt-3 transition-colors duration-300"
      >
        {role.description}
      </p>
    </li>
  );
}
