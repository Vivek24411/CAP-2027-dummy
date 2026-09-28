import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@/components/icons/HeartIcon";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { EsummitLogo } from "@/components/ui/EsummitLogo";
import { getFooter } from "@/controllers/content";
import type { NavLink } from "@/models/navigation";

// Hover: the text brightens and an underline grows in from the left.
const linkClassName =
  "text-secondary hover:text-foreground relative inline-flex min-h-11 min-w-11 items-center transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-[9px] after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-[scale] after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h3 className="text-muted text-xs font-medium tracking-[0.12em] uppercase">{title}</h3>
      <ul className="mt-3 flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const footer = await getFooter();

  return (
    <footer className="px-4 pb-6 md:px-8 md:pb-8">
      <div className="border-line bg-surface rounded-card mx-auto max-w-[80rem] border px-6 md:px-12">
        <div className="grid gap-12 pt-12 pb-10 md:pt-14 lg:grid-cols-[minmax(0,1fr)_14rem_14rem] lg:gap-x-12 lg:gap-y-10">
          <div>
            <div className="flex items-center gap-5">
              <EsummitLogo className="w-40 md:w-[184px]" />
              <span className="bg-line-strong h-10 w-px" aria-hidden="true" />
              <Image
                src="/images/logos/ecell-logo.png"
                alt="E-Cell IIT Roorkee"
                width={126}
                height={54}
                className="h-auto w-24 md:w-[112px]"
              />
            </div>
            <p className="text-body text-secondary mt-8 max-w-[28rem]">{footer.tagline}</p>
          </div>

          <FooterColumn title="Explore" links={footer.explore} />
          <FooterColumn title="Contacts" links={footer.contacts} />

          <address className="not-italic">
            <h3 className="text-muted text-xs font-medium tracking-[0.12em] uppercase">Address</h3>
            <div className="text-body text-secondary mt-5">
              {footer.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </address>

          <ul className="flex gap-2 self-end lg:col-span-2 lg:justify-end">
            {footer.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-line-strong text-secondary hover:text-foreground flex size-11 items-center justify-center rounded-full border transition-colors duration-200 hover:border-white/30"
                >
                  <SocialIcon platform={social.platform} className="size-[1.125rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-line text-muted flex flex-col gap-2 border-t py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-1.5">
            Made with
            <HeartIcon className="text-accent size-3.5" />
            <span className="sr-only">love</span> {footer.credit}
          </p>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
