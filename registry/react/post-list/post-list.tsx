/**
 * PostList: the body of a blog index, a category page or a related list.
 *
 * A featured card, then the grid of post cards, with the category filters as
 * links to real pages, a pagination slot and an empty state for a filter
 * without results. Neither the featured post nor the cards come with data from
 * the component: every post arrives through props, and the caller keeps the
 * featured one out of the grid.
 *
 * Motion: the featured card reveals once and the cards of the grid reveal in a
 * stagger of 60 ms as they enter. The filters press on tap. Under reduced
 * motion everything is in place from the first paint.
 *
 * Catalog: post-list
 */
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";
import { Reveal, RevealItem } from "@designfy/components/reveal/reveal";
import { PostCard, type PostCardData } from "@designfy/components/post-card/post-card";

export interface PostListCategory {
  label: string;
  href: string;
  /** Marks the filter of the page being read. */
  current?: boolean;
}

export interface PostListProps {
  /** Posts of the grid, in reading order. */
  posts: PostCardData[];
  /** The post shown above the grid, larger. */
  featured?: PostCardData;
  /** Category filters, as links to real pages. */
  categories?: PostListCategory[];
  /** Accessible name of the filter navigation. Default "Categories". */
  categoriesLabel?: string;
  /** Pagination controls, already built by the page. */
  pagination?: ReactNode;
  /** Heading of the empty state. */
  emptyTitle?: string;
  /** One sentence about what will appear here. */
  emptyText?: string;
  /** The action that leaves the empty state. */
  emptyAction?: { label: string; href: string };
  /** Heading level of the cards. Default 3. */
  headingLevel?: 2 | 3;
  className?: string;
}

/** Lays out the posts of a blog or a category. */
export function PostList({
  posts,
  featured,
  categories,
  categoriesLabel = "Categories",
  pagination,
  emptyTitle,
  emptyText,
  emptyAction,
  headingLevel = 3,
  className,
}: PostListProps) {
  const empty = posts.length === 0 && featured === undefined;
  const EmptyHeading = `h${headingLevel}` as "h2" | "h3";

  return (
    <div className={cn("min-w-0", className)}>
      {categories && categories.length > 0 ? (
        <nav aria-label={categoriesLabel} className="mb-8">
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.href}>
                <a
                  href={category.href}
                  aria-current={category.current ? "page" : undefined}
                  className={cn(
                    "df-press inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
                    category.current
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {category.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {featured ? (
        <Reveal className="mb-8 md:mb-12">
          <PostCard {...featured} variant="featured" headingLevel={headingLevel === 2 ? 2 : 3} />
        </Reveal>
      ) : null}

      {empty ? (
        <div className="flex flex-col items-start gap-4 rounded-xl bg-muted/50 px-6 py-10 md:px-8">
          <EmptyHeading className="font-heading text-title font-semibold text-balance text-foreground">{emptyTitle}</EmptyHeading>
          {emptyText ? <p className="max-w-[46ch] text-muted-foreground">{emptyText}</p> : null}
          {emptyAction ? (
            <a
              href={emptyAction.href}
              className="df-press mt-2 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {emptyAction.label}
            </a>
          ) : null}
        </div>
      ) : null}

      {posts.length > 0 ? (
        <Reveal as="ul" stagger={0.06} className="grid grid-cols-1 gap-6 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]">
          {posts.map((post) => (
            <RevealItem as="li" key={post.href} className="flex min-w-0">
              <PostCard {...post} headingLevel={headingLevel} className="w-full" />
            </RevealItem>
          ))}
        </Reveal>
      ) : null}

      {pagination ? <div className="mt-12 flex justify-center">{pagination}</div> : null}
    </div>
  );
}
