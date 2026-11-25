/**
 * PostCard: one article inside a list, with cover, category, title, excerpt and
 * authorship.
 *
 * The card is one target: the title link stretches over the whole card through
 * an ::after layer; the category link sits above that layer and keeps its own
 * focus. The layout answers to the width of the card, not of the screen
 * (@container), so the same card works in a column, in a grid and in a sidebar.
 *
 * Motion: the cover scales to 1.03 inside its frame and the title underline
 * grows, both from the hover of the card; on press the card settles to 0.99.
 * No motion under reduced motion.
 *
 * Catalog: post-card
 */
import { cn } from "@designfy/components/lib/cn";

export interface PostCover {
  src: string;
  /** Empty when the title already says what the image shows. */
  alt: string;
  width: number;
  height: number;
}

export interface PostCardData {
  /** Title of the article; it is the accessible name of the card link. */
  title: string;
  href: string;
  excerpt?: string;
  category?: { label: string; href: string };
  author?: string;
  date?: { iso: string; label: string };
  readingTime?: string;
  cover?: PostCover;
}

export interface PostCardProps extends PostCardData {
  /** Layout of the card. "horizontal" and "featured" change above their container width. */
  variant?: "vertical" | "horizontal" | "featured" | "text";
  /** Heading level of the title. Default 3. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Summarizes an article in a list. */
export function PostCard({
  title,
  href,
  excerpt,
  category,
  author,
  date,
  readingTime,
  cover,
  variant = "vertical",
  headingLevel = 3,
  className,
}: PostCardProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const horizontal = variant === "horizontal";
  const featured = variant === "featured";

  return (
    <article
      className={cn(
        "group @container relative isolate min-w-0 overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          horizontal && "@[26rem]:grid @[26rem]:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]",
          featured && "@[40rem]:grid @[40rem]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]",
        )}
      >
        {cover ? (
          <div
            className={cn(
              "relative overflow-hidden bg-muted",
              horizontal || featured ? "aspect-[16/10] @[26rem]:aspect-auto @[26rem]:h-full" : "aspect-[16/10]",
            )}
          >
            <img
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-(--duration-slow) ease-out-quart group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : null}

        <div className={cn("flex min-w-0 flex-1 flex-col gap-3 p-5 md:p-6", featured && "@[40rem]:justify-center")}>
          {category ? (
            <a href={category.href} className="df-underline relative z-10 w-fit text-sm font-semibold text-primary">
              {category.label}
            </a>
          ) : null}

          <Heading
            className={cn(
              "font-heading font-semibold text-balance text-foreground",
              featured ? "text-title @[40rem]:text-headline" : "text-title",
            )}
          >
            <a href={href} className="df-underline after:absolute after:inset-0 after:content-['']">
              {title}
            </a>
          </Heading>

          {excerpt ? (
            <p className={cn("text-sm leading-relaxed text-muted-foreground", featured ? "line-clamp-4" : "line-clamp-3")}>
              {excerpt}
            </p>
          ) : null}

          {author || date || readingTime ? (
            <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-sm text-muted-foreground">
              {author ? <span className="font-medium text-foreground">{author}</span> : null}
              {author && date ? <span aria-hidden="true">·</span> : null}
              {date ? <time dateTime={date.iso}>{date.label}</time> : null}
              {(author || date) && readingTime ? <span aria-hidden="true">·</span> : null}
              {readingTime ? <span>{readingTime}</span> : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
