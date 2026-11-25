/**
 * AuthorBox: says who wrote the content, with the short bio and the links of
 * the person.
 *
 * The avatar sits above the text on phones and beside it from 640 px. The name
 * is a heading at `headingLevel`; every link carries its own name. Without a
 * bio or links the block keeps only what it received.
 *
 * Motion: the block reveals once when it enters the viewport, through Reveal.
 * Under reduced motion it renders in its final state.
 *
 * Catalog: author-box
 */
import { cn } from "@designfy/components/lib/cn";
import { Reveal } from "@designfy/components/reveal/reveal";

export interface AuthorAvatar {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AuthorLink {
  label: string;
  href: string;
}

export interface AuthorBoxProps {
  /** Name of the person. */
  name: string;
  /** What the person does, in a few words. */
  role?: string;
  /** Two or three sentences about the person. */
  bio?: string;
  /** Portrait of the person. */
  avatar?: AuthorAvatar;
  /** Official links of the person. */
  links?: AuthorLink[];
  /** Heading level of the name. Default 3. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Introduces the author of the content. */
export function AuthorBox({ name, role, bio, avatar, links, headingLevel = 3, className }: AuthorBoxProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-start md:p-8",
        className,
      )}
    >
      {avatar ? (
        <img
          src={avatar.src}
          alt={avatar.alt}
          width={avatar.width}
          height={avatar.height}
          loading="lazy"
          decoding="async"
          className="size-16 shrink-0 rounded-full bg-muted object-cover"
        />
      ) : null}
      <div className="flex min-w-0 flex-col gap-2">
        <Heading className="font-heading text-title font-semibold text-foreground">{name}</Heading>
        {role ? <p className="text-sm font-medium text-primary">{role}</p> : null}
        {bio ? <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">{bio}</p> : null}
        {links && links.length > 0 ? (
          <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="df-underline inline-flex min-h-11 items-center text-sm font-medium text-foreground sm:min-h-6">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Reveal>
  );
}
