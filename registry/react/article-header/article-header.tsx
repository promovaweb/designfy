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

export interface ArticleAuthor {
  name: string;
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
  author?: ArticleAuthor;
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

  return (
    <header className={cn("relative isolate", className)}>
      {onCover ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <img src={cover.src} alt="" width={cover.width} height={cover.height} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/25" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
        </div>
      ) : null}

      <div className={cn("df-container", onCover ? "py-14 md:py-20" : "pt-10 md:pt-16")}>
        <div
          className={cn(
            "flex max-w-3xl flex-col gap-5",
            onCover ? "py-6 md:py-10" : "mx-auto",
            centered && "mx-auto items-center text-center",
          )}
        >
          {category ? (
            <a
              href={category.href}
              className="df-underline animate-df-fade-up text-sm font-semibold text-primary"
            >
              {category.label}
            </a>
          ) : null}

          <h1
            className="animate-df-fade-up font-heading text-headline font-semibold text-balance text-foreground [animation-delay:60ms]"
          >
            {title}
          </h1>

          {lead ? (
            <p
              className="animate-df-fade-up max-w-[62ch] text-lead text-muted-foreground [animation-delay:120ms]"
            >
              {lead}
            </p>
          ) : null}

          {author || date || readingTime ? (
            <div
              className={cn(
                "flex animate-df-fade-up flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground [animation-delay:180ms]",
                centered && "justify-center",
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
