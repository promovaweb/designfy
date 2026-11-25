/**
 * ArticleHeader: introduces an article with category, title, lead, authorship
 * and cover.
 *
 * Three variants: "left" (title left, cover below), "centered" (everything
 * centered) and "behind" (the cover sits behind the title, under a scrim of
 * the foreground role, so the text keeps its contrast in both themes). The
 * title is the page h1 and every date goes through <time datetime>.
 *
 * Motion: title, lead and meta fade up in a short sequence; the cover below
 * reveals with a soft scale. Both run once, in CSS, and stay in place under
 * reduced motion.
 *
 * Catalog: article-header
 */
import { cn } from "@designfy/components/lib/cn";

export interface ArticleCover {
  src: string;
  /** Describes the cover; empty only when the title already says it. */
  alt: string;
  width: number;
  height: number;
}

export interface ArticleLink {
  label: string;
  href: string;
}

export interface ArticleHeaderProps {
  /** The h1 of the page. */
  title: string;
  /** One paragraph that opens the subject. */
  lead?: string;
  /** Category of the article, linked to its page. */
  category?: ArticleLink;
  /** Author name, linked to the author page. */
  author?: ArticleLink;
  /** Publication date: the ISO value and the visible label. */
  date?: { iso: string; label: string };
  /** Reading time, already written as text ("8 min read"). */
  readingTime?: string;
  /** Cover image, with its intrinsic size. */
  cover?: ArticleCover;
  /** Layout of the header. Default "left". */
  variant?: "left" | "centered" | "behind";
  className?: string;
}

/** Opens an article with title, context and authorship. */
export function ArticleHeader({
  title,
  lead,
  category,
  author,
  date,
  readingTime,
  cover,
  variant = "left",
  className,
}: ArticleHeaderProps) {
  const centered = variant === "centered";
  const onCover = variant === "behind" && cover !== undefined;
  const metaText = onCover ? "text-background/75" : "text-muted-foreground";

  return (
    <header className={cn("relative isolate", className)}>
      {onCover ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img src={cover.src} alt="" width={cover.width} height={cover.height} className="size-full object-cover" />
          <div className="absolute inset-0 bg-foreground/75" />
        </div>
      ) : null}

      <div className={cn("df-container", onCover ? "py-20 md:py-28" : "pt-10 md:pt-16")}>
        <div className={cn("mx-auto flex max-w-3xl flex-col gap-5", centered && "items-center text-center", onCover && "py-4")}>
          {category ? (
            <a
              href={category.href}
              className={cn(
                "df-underline animate-df-fade-up text-sm font-semibold",
                onCover ? "text-background" : "text-primary",
              )}
            >
              {category.label}
            </a>
          ) : null}

          <h1
            className={cn(
              "animate-df-fade-up font-heading text-headline font-semibold text-balance [animation-delay:60ms]",
              onCover ? "text-background" : "text-foreground",
            )}
          >
            {title}
          </h1>

          {lead ? (
            <p
              className={cn(
                "animate-df-fade-up max-w-[62ch] text-lead [animation-delay:120ms]",
                onCover ? "text-background/85" : "text-muted-foreground",
              )}
            >
              {lead}
            </p>
          ) : null}

          {author || date || readingTime ? (
            <div
              className={cn(
                "flex animate-df-fade-up flex-wrap items-center gap-x-2 gap-y-1 text-sm [animation-delay:180ms]",
                centered && "justify-center",
                metaText,
              )}
            >
              {author ? (
                <a href={author.href} className="df-underline font-medium text-current">
                  {author.name}
                </a>
              ) : null}
              {author && date ? <span aria-hidden="true">·</span> : null}
              {date ? <time dateTime={date.iso}>{date.label}</time> : null}
              {(author || date) && readingTime ? <span aria-hidden="true">·</span> : null}
              {readingTime ? <span>{readingTime}</span> : null}
            </div>
          ) : null}
        </div>

        {cover && variant !== "behind" ? (
          <img
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            className="mt-10 w-full animate-df-scale-in rounded-xl border border-border bg-muted object-cover [animation-delay:120ms] [animation-duration:var(--duration-slower)] md:mt-14"
            style={{ aspectRatio: `${cover.width} / ${cover.height}` }}
          />
        ) : null}
      </div>
    </header>
  );
}
