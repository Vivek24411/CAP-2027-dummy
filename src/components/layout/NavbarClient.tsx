"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EsummitLogo } from "@/components/ui/EsummitLogo";
import { useActiveSection } from "@/controllers/useActiveSection";
import { useDisclosure } from "@/controllers/useDisclosure";
import { useScrolled } from "@/controllers/useScrolled";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/models/navigation";
import { MobileMenu, MobileMenuButton } from "./MobileMenu";

// "/" → "home", "/#faqs" → "faqs"
const sectionIdFor = (href: string) => (href === "/" ? "home" : (href.split("#")[1] ?? ""));

// Floating pill navbar. Transparent at the top of the page; after 40px of scroll it gets a
// blurred surface, a hairline border and gets slightly shorter. A small dot slides under
// the link of the section in view. Below lg the links move into a full-screen menu.
// Drops in once on page load, just after the hero intro starts (see globals.css).
export function NavbarClient({ links, cta }: { links: NavLink[]; cta: NavLink }) {
  const scrolled = useScrolled(40);
  const menu = useDisclosure();
  const onHome = usePathname() === "/";
  const active = useActiveSection(
    links.map((link) => sectionIdFor(link.href)),
    onHome,
  );

  const listRef = useRef<HTMLUListElement>(null);
  const [dotX, setDotX] = useState<number | null>(null);

  // Centre the dot under the active link; re-measure when the layout changes size.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const link = active ? list.querySelector<HTMLElement>(`[data-section="${active}"]`) : null;
      setDotX(link ? link.offsetLeft + link.offsetWidth / 2 : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  const raised = scrolled || menu.isOpen;

  return (
    <>
      <header data-nav-intro className="fixed inset-x-0 top-3 z-50 px-4 md:top-5">
        <nav
          aria-label="Main"
          className={cn(
            "relative mx-auto grid max-w-[66rem] grid-cols-[1fr_auto] items-center rounded-full border pr-2 pl-5 transition-[height,background-color,border-color,backdrop-filter] duration-[250ms] ease-out lg:grid-cols-[1fr_auto_1fr] lg:pr-3",
            raised
              ? "border-line bg-surface/70 h-14 backdrop-blur-md md:h-16"
              : "h-16 border-transparent bg-transparent md:h-[4.5rem]",
          )}
        >
          <Link
            href="/"
            aria-label="E-Summit home"
            className="flex h-11 items-center justify-self-start"
          >
            <EsummitLogo preload className="w-36 md:w-[168px]" />
          </Link>

          <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const id = sectionIdFor(link.href);
              const isActive = id === active;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-section={id}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex h-11 items-center rounded-full px-3.5 text-[0.9375rem] transition-colors duration-200",
                      isActive ? "text-foreground" : "text-secondary hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {/* Active-section dot */}
            <li
              aria-hidden="true"
              className={cn(
                "bg-accent pointer-events-none absolute -bottom-1 left-0 size-1 rounded-full transition-[transform,opacity] duration-300 ease-out",
                dotX === null ? "opacity-0" : "opacity-100",
              )}
              style={{ transform: `translateX(${(dotX ?? 0) - 2}px)` }}
            />
          </ul>

          <div className="flex items-center gap-1 justify-self-end">
            {/* Visibility lives on the wrapper so it can't clash with the button's own display */}
            <div className="hidden sm:block">
              <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
            </div>
            <MobileMenuButton open={menu.isOpen} onClick={menu.toggle} />
          </div>
        </nav>
      </header>

      <MobileMenu open={menu.isOpen} onClose={menu.close} links={links} cta={cta} />
    </>
  );
}
