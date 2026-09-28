import { ImageSlot } from "@/components/ui/ImageSlot";
import { cn } from "@/lib/utils";
import type { Benefit } from "@/models/whyCap";

type BenefitCardProps = {
  benefit: Benefit;
  index: number;
  total: number;
  // From 1024px up: put the picture on the right. On phones the picture is always on top.
  imageRight?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function BenefitCard({ benefit, index, total, imageRight = false }: BenefitCardProps) {
  const number = pad(index + 1);

  return (
    <article
      data-benefit
      className="group/card border-line bg-surface/80 rounded-card grid items-center gap-6 border p-2 md:p-3 lg:grid-cols-2 lg:gap-4"
    >
      <ImageSlot
        src={benefit.image}
        alt={benefit.imageAlt}
        label={number}
        sizes="(min-width: 1200px) 560px, (min-width: 1024px) 46vw, 100vw"
        revealFrom={imageRight ? "right" : "left"}
        className={cn(imageRight && "lg:order-last")}
      />

      <div data-reveal="fade-up" className="px-4 pb-6 md:px-6 lg:px-10 lg:py-8">
        <p aria-hidden="true" className="text-muted flex items-center gap-3 text-sm tabular-nums">
          <span className="text-accent">{number}</span>
          <span className="bg-line-strong h-px w-8" />
          <span>{pad(total)}</span>
        </p>
        <h3 className="text-foreground mt-6 text-[1.75rem] leading-tight font-medium tracking-[-0.02em] md:text-[2.25rem]">
          {benefit.title}
        </h3>
        <p className="text-body-lg text-secondary mt-4 max-w-[34rem]">{benefit.description}</p>
      </div>
    </article>
  );
}
