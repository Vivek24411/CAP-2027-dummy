"use client";

import { PlusIcon } from "@/components/icons/PlusIcon";
import { useAccordion } from "@/controllers/useAccordion";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/models/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const { isOpen, toggle } = useAccordion(items[0]?.id ?? null);

  return (
    <ul className="divide-line border-line divide-y border-y">
      {items.map((item) => {
        const open = isOpen(item.id);
        const buttonId = `faq-button-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <li key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="text-foreground text-[1.0625rem] leading-snug font-medium md:text-lg">
                  {item.question}
                </span>
                <PlusIcon
                  open={open}
                  className="text-muted group-hover:text-foreground size-6 shrink-0"
                />
              </button>
            </h3>

            {/* grid-rows 0fr → 1fr animates to the panel's natural height */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-[400ms] ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-body text-secondary measure pr-12 pb-6">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
