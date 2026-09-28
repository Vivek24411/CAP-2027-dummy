import Image from "next/image";
import { MailIcon } from "@/components/icons/MailIcon";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { gmailComposeUrl, telHref } from "@/controllers/contactLinks";
import type { TeamContact } from "@/models/about";

const linkClassName =
  "border-line-strong text-secondary hover:text-foreground flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 text-sm transition-colors duration-200 hover:border-white/30";

// Photo on top, details and links below — everything visible at once, no flipping.
// Hover: the card lifts 4px and its border brightens.
export function ContactCard({ contact }: { contact: TeamContact }) {
  return (
    <article className="border-line bg-surface hover:border-line-strong rounded-card flex h-full flex-col overflow-hidden border transition-[translate,border-color] duration-200 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div className="bg-raised relative aspect-[4/5]">
        <Image
          src={contact.photo}
          alt={contact.name}
          fill
          sizes="(min-width: 1024px) 320px, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="text-foreground text-base leading-tight font-semibold md:text-lg">
          {contact.name}
        </h3>
        <p className="text-accent mt-1 text-sm">{contact.role}</p>
        {contact.phone && (
          <a
            href={telHref(contact.phone)}
            className="text-secondary hover:text-foreground mt-1 inline-flex h-11 items-center self-start text-sm tabular-nums transition-colors duration-200"
          >
            {contact.phone}
          </a>
        )}

        {(contact.email || contact.linkedin) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {contact.email && (
              <a
                href={gmailComposeUrl(contact.email)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Email ${contact.name} with Gmail`}
                className={linkClassName}
              >
                <MailIcon className="size-[1.125rem]" />
                <span aria-hidden="true" className="hidden sm:inline">
                  Gmail
                </span>
              </a>
            )}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${contact.name} on LinkedIn`}
                className={linkClassName}
              >
                <SocialIcon platform="linkedin" className="size-[1.125rem]" />
                <span aria-hidden="true" className="hidden sm:inline">
                  LinkedIn
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
