"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useScrollLock } from "@/controllers/useScrollLock";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/models/navigation";

// Hamburger that morphs into a close icon. Lives inside the navbar pill (below lg only).
export function MobileMenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
      onClick={onClick}
      className="text-foreground flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/[0.06] lg:hidden"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
        className="size-6"
      >
        <path
          d="M4 8h16"
          className={cn(
            "origin-center transition-transform duration-300 ease-out",
            open && "translate-y-[4px] rotate-45",
          )}
        />
        <path
          d="M4 16h16"
          className={cn(
            "origin-center transition-transform duration-300 ease-out",
            open && "-translate-y-[4px] -rotate-45",
          )}
        />
      </svg>
    </button>
  );
}

// Full-screen menu under the navbar pill. Links stagger in 40ms apart; the page behind
// doesn't scroll while it's open; Escape closes it (see useDisclosure).
export function MobileMenu({
  open,
  onClose,
  links,
  cta,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  cta: NavLink;
}) {
  useScrollLock(open);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Move focus into the menu once it's visible (focus fails while it's still `visibility: hidden`).
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  const items = [...links.map((link) => ({ ...link, cta: false })), { ...cta, cta: true }];

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "bg-background/[0.98] fixed inset-0 z-40 flex flex-col px-6 pt-28 pb-10 transition-[opacity,visibility] duration-300 ease-out lg:hidden",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <ul className="border-line flex flex-col border-t">
        {items.map((item, index) => (
          <li
            key={`${item.href}-${index}`}
            style={{ transitionDelay: open ? `${80 + index * 40}ms` : "0ms" }}
            className={cn(
              "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              item.cta ? "mt-8 sm:hidden" : "border-line border-b",
            )}
          >
            {item.cta ? (
              <ButtonLink href={item.href} size="lg" onClick={onClose} className="w-full">
                {item.label}
              </ButtonLink>
            ) : (
              <Link
                ref={index === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={onClose}
                className="text-foreground flex items-center justify-between py-5 text-2xl font-medium tracking-[-0.02em]"
              >
                {item.label}
                <span aria-hidden="true" className="text-muted text-sm tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
